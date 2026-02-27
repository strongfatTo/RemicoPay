// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPaymentVerifier.sol";

/// @title RemicoPay - HKD → PHP Cross-Border Remittance on Etherlink
/// @notice Escrow-based remittance: locks HKDR from sender, releases PHPC to recipient
/// @dev Applies CEI pattern, ReentrancyGuard, SafeERC20, exchange rate locking
interface IMockPHPC {
    function mint(address to, uint256 amount) external;
}

contract RemicoPay is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ─── Storage (packed) ────────────────────────────────────────────
    IERC20 public immutable hkdr;
    address public immutable phpc;

    uint256 public exchangeRate;   // HKDR → PHPC rate, scaled by 1e6 (e.g. 7_350_000 = 7.35)
    uint256 public feeBps;         // Fee in basis points (70 = 0.7%)
    uint256 public nextRemitId;    // Auto-incrementing remittance ID

    // FPS integration
    IPaymentVerifier public paymentVerifier;
    mapping(uint256 => bytes32) public remitFPSRef;  // remitId → fpsPaymentRef

    // ─── Remittance Status ───────────────────────────────────────────
    enum Status { Pending, Completed, Refunded }

    struct Remittance {
        address sender;
        address recipient;
        uint256 hkdAmount;       // HKDR locked
        uint256 phpAmount;       // PHPC to release
        uint256 fee;             // Fee in HKDR
        uint256 lockedRate;      // Exchange rate at creation time
        uint64  createdAt;       // Timestamp
        Status  status;
    }

    mapping(uint256 => Remittance) public remittances;

    // ─── Custom Errors ───────────────────────────────────────────────
    error ZeroAmount();
    error ZeroAddress();
    error InvalidRate();
    error InvalidFee();
    error RemittanceNotFound();
    error RemittanceNotPending();
    error InsufficientAllowance();
    error NoPaymentVerifier();
    error PaymentNotVerified();
    error FPSRemittanceNotPending();

    // ─── Events ──────────────────────────────────────────────────────
    event RemittanceCreated(
        uint256 indexed remitId,
        address indexed sender,
        address indexed recipient,
        uint256 hkdAmount,
        uint256 phpAmount,
        uint256 fee,
        uint256 rate
    );
    event RemittanceCompleted(uint256 indexed remitId, address indexed recipient, uint256 phpAmount);
    event RemittanceRefunded(uint256 indexed remitId, address indexed sender, uint256 hkdAmount);
    event ExchangeRateUpdated(uint256 oldRate, uint256 newRate);
    event FeeBpsUpdated(uint256 oldFee, uint256 newFee);
    event FPSRemittanceCreated(uint256 indexed remitId, address indexed sender, bytes32 fpsPaymentRef, uint256 hkdAmount);
    event FPSRemittanceCompleted(uint256 indexed remitId, address indexed recipient, uint256 phpAmount);
    event PaymentVerifierUpdated(address indexed oldVerifier, address indexed newVerifier);

    // ─── Constructor ─────────────────────────────────────────────────
    /// @param _hkdr Address of MockHKDR token
    /// @param _phpc Address of MockPHPC token
    /// @param _exchangeRate Initial HKD→PHP rate (scaled by 1e6, e.g. 7_350_000 = 7.35)
    /// @param _feeBps Fee in basis points (70 = 0.7%)
    constructor(
        address _hkdr,
        address _phpc,
        uint256 _exchangeRate,
        uint256 _feeBps
    ) Ownable(msg.sender) {
        if (_hkdr == address(0) || _phpc == address(0)) revert ZeroAddress();
        if (_exchangeRate == 0) revert InvalidRate();
        if (_feeBps > 1000) revert InvalidFee(); // Max 10%

        hkdr = IERC20(_hkdr);
        phpc = _phpc;
        exchangeRate = _exchangeRate;
        feeBps = _feeBps;
    }

    // ─── View Functions ──────────────────────────────────────────────

    /// @notice Get a quote for converting HKD to PHP
    /// @param hkdAmount Amount of HKDR to convert (18 decimals)
    /// @return phpAmount Amount of PHPC recipient will receive
    /// @return fee Fee deducted in HKDR
    /// @return rate Current exchange rate used
    function getQuote(uint256 hkdAmount) external view returns (
        uint256 phpAmount,
        uint256 fee,
        uint256 rate
    ) {
        if (hkdAmount == 0) revert ZeroAmount();

        rate = exchangeRate;
        // Fee calculated on input amount (multiply before divide for precision)
        fee = (hkdAmount * feeBps) / 10_000;
        uint256 netHkd = hkdAmount - fee;
        // Convert HKD to PHP: netHkd * rate / 1e6
        phpAmount = (netHkd * rate) / 1e6;
    }

    /// @notice Get remittance details by ID
    /// @param remitId Remittance ID
    function getRemittance(uint256 remitId) external view returns (Remittance memory) {
        if (remitId >= nextRemitId) revert RemittanceNotFound();
        return remittances[remitId];
    }

    // ─── State-Changing Functions ────────────────────────────────────

    /// @notice Create a new remittance (instant settlement: locks HKDR + mints PHPC in one tx)
    /// @param recipient Address to receive PHPC
    /// @param hkdAmount Amount of HKDR to send (18 decimals)
    /// @return remitId The ID of the created remittance
    function createRemittance(
        address recipient,
        uint256 hkdAmount
    ) external nonReentrant returns (uint256 remitId) {
        // ── CHECKS ──
        if (recipient == address(0)) revert ZeroAddress();
        if (hkdAmount == 0) revert ZeroAmount();

        // Cache storage reads
        uint256 _rate = exchangeRate;
        uint256 _feeBps = feeBps;

        // Calculate fee and PHP amount
        uint256 fee = (hkdAmount * _feeBps) / 10_000;
        uint256 netHkd = hkdAmount - fee;
        uint256 phpAmount = (netHkd * _rate) / 1e6;

        // ── EFFECTS ──
        remitId = nextRemitId;
        unchecked { ++nextRemitId; } // Safe: won't overflow in practice

        remittances[remitId] = Remittance({
            sender: msg.sender,
            recipient: recipient,
            hkdAmount: hkdAmount,
            phpAmount: phpAmount,
            fee: fee,
            lockedRate: _rate,
            createdAt: uint64(block.timestamp),
            status: Status.Completed
        });

        emit RemittanceCreated(remitId, msg.sender, recipient, hkdAmount, phpAmount, fee, _rate);
        emit RemittanceCompleted(remitId, recipient, phpAmount);

        // ── INTERACTIONS ──
        // Transfer HKDR from sender to this contract
        hkdr.safeTransferFrom(msg.sender, address(this), hkdAmount);
        // Mint PHPC to recipient instantly
        IMockPHPC(phpc).mint(recipient, phpAmount);
    }

    /// @notice Complete a remittance (mint PHPC to recipient)
    /// @dev Only owner can complete (simulates off-ramp settlement)
    /// @param remitId Remittance ID to complete
    function completeRemittance(uint256 remitId) external onlyOwner nonReentrant {
        // ── CHECKS ──
        if (remitId >= nextRemitId) revert RemittanceNotFound();
        Remittance storage remit = remittances[remitId];
        if (remit.status != Status.Pending) revert RemittanceNotPending();

        // Cache for event
        address recipient = remit.recipient;
        uint256 phpAmount = remit.phpAmount;

        // ── EFFECTS ──
        remit.status = Status.Completed;

        emit RemittanceCompleted(remitId, recipient, phpAmount);

        // ── INTERACTIONS ──
        // Mint PHPC to recipient
        IMockPHPC(phpc).mint(recipient, phpAmount);
    }

    /// @notice Refund a pending remittance (return HKDR to sender)
    /// @dev Only owner can refund
    /// @param remitId Remittance ID to refund
    function refundRemittance(uint256 remitId) external onlyOwner nonReentrant {
        // ── CHECKS ──
        if (remitId >= nextRemitId) revert RemittanceNotFound();
        Remittance storage remit = remittances[remitId];
        if (remit.status != Status.Pending) revert RemittanceNotPending();

        // Cache for event and transfer
        address sender = remit.sender;
        uint256 hkdAmount = remit.hkdAmount;

        // ── EFFECTS ──
        remit.status = Status.Refunded;

        emit RemittanceRefunded(remitId, sender, hkdAmount);

        // ── INTERACTIONS ──
        hkdr.safeTransfer(sender, hkdAmount);
    }

    // ─── FPS Remittance Flow ──────────────────────────────────────────

    /// @notice Create a remittance paid via FPS (no HKDR lock — pending verification)
    /// @param recipient Address to receive PHPC
    /// @param hkdAmount Amount of HKD being sent via FPS
    /// @param fpsPaymentRef Hash of the FPS reference number
    function createRemittanceWithFPS(
        address recipient,
        uint256 hkdAmount,
        bytes32 fpsPaymentRef
    ) external nonReentrant returns (uint256 remitId) {
        if (recipient == address(0)) revert ZeroAddress();
        if (hkdAmount == 0) revert ZeroAmount();
        if (address(paymentVerifier) == address(0)) revert NoPaymentVerifier();

        uint256 _rate = exchangeRate;
        uint256 _feeBps = feeBps;
        uint256 fee = (hkdAmount * _feeBps) / 10_000;
        uint256 netHkd = hkdAmount - fee;
        uint256 phpAmount = (netHkd * _rate) / 1e6;

        remitId = nextRemitId;
        unchecked { ++nextRemitId; }

        remittances[remitId] = Remittance({
            sender: msg.sender,
            recipient: recipient,
            hkdAmount: hkdAmount,
            phpAmount: phpAmount,
            fee: fee,
            lockedRate: _rate,
            createdAt: uint64(block.timestamp),
            status: Status.Pending  // Pending until FPS is verified
        });

        remitFPSRef[remitId] = fpsPaymentRef;

        emit FPSRemittanceCreated(remitId, msg.sender, fpsPaymentRef, hkdAmount);
    }

    /// @notice Complete an FPS remittance after payment is verified
    /// @param remitId Remittance ID to complete
    function completeRemittanceWithFPS(uint256 remitId) external onlyOwner nonReentrant {
        if (remitId >= nextRemitId) revert RemittanceNotFound();
        Remittance storage remit = remittances[remitId];
        if (remit.status != Status.Pending) revert FPSRemittanceNotPending();

        bytes32 fpsRef = remitFPSRef[remitId];
        if (!paymentVerifier.isPaymentVerified(fpsRef)) revert PaymentNotVerified();

        address recipient = remit.recipient;
        uint256 phpAmount = remit.phpAmount;

        remit.status = Status.Completed;

        emit FPSRemittanceCompleted(remitId, recipient, phpAmount);

        IMockPHPC(phpc).mint(recipient, phpAmount);
    }

    // ─── Admin Functions ─────────────────────────────────────────────

    /// @notice Set the payment verifier contract
    function setPaymentVerifier(address _verifier) external onlyOwner {
        address old = address(paymentVerifier);
        paymentVerifier = IPaymentVerifier(_verifier);
        emit PaymentVerifierUpdated(old, _verifier);
    }

    /// @notice Update the exchange rate
    /// @param newRate New HKD→PHP rate (scaled by 1e6)
    function setExchangeRate(uint256 newRate) external onlyOwner {
        if (newRate == 0) revert InvalidRate();
        uint256 oldRate = exchangeRate;
        exchangeRate = newRate;
        emit ExchangeRateUpdated(oldRate, newRate);
    }

    /// @notice Update the fee rate
    /// @param newFeeBps New fee in basis points (max 1000 = 10%)
    function setFeeBps(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > 1000) revert InvalidFee();
        uint256 oldFee = feeBps;
        feeBps = newFeeBps;
        emit FeeBpsUpdated(oldFee, newFeeBps);
    }
}
