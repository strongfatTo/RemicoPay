// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ScheduledRemittance - Scheduled HKD→PHP transfers with yield
/// @notice Users deposit HKDR into an ERC-4626 vault and schedule future remittances.
///         Yield earned reduces (or eliminates) the remittance fee.
/// @dev Yield split: 70% user (offsets fee), 30% protocol

interface IScheduledMintable {
    function mint(address to, uint256 amount) external;
}

contract ScheduledRemittance is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ─── Types ────────────────────────────────────────────────────────
    enum Status { Scheduled, Executed, Cancelled }

    struct ScheduledTransfer {
        address sender;
        address recipient;
        uint256 hkdAmount;       // Original HKDR deposited
        uint256 vaultShares;     // ERC-4626 shares received
        uint64  scheduledDate;   // Execution timestamp
        uint64  createdAt;
        bool    isRecurring;
        uint8   recurringDay;    // Day of month (1-28)
        Status  status;
    }

    // ─── Storage ──────────────────────────────────────────────────────
    IERC20 public immutable hkdr;
    address public immutable phpc;
    ERC4626 public immutable vault;

    uint256 public exchangeRate;  // HKD→PHP scaled by 1e6
    uint256 public feeBps;        // Base fee in basis points (e.g. 70 = 0.7%)
    uint256 public nextScheduleId;

    address public protocolTreasury;

    mapping(uint256 => ScheduledTransfer) public schedules;

    // ─── Constants ────────────────────────────────────────────────────
    uint256 public constant USER_YIELD_SHARE = 70;     // 70%
    uint256 public constant PROTOCOL_YIELD_SHARE = 30; // 30%
    uint256 public constant MAX_FEE_BPS = 1000;        // 10%

    // ─── Errors ───────────────────────────────────────────────────────
    error ZeroAmount();
    error ZeroAddress();
    error InvalidDate();
    error InvalidDay();
    error InvalidRate();
    error InvalidFee();
    error ScheduleNotFound();
    error NotSender();
    error NotScheduled();
    error TooEarly();
    error AlreadyExecutedOrCancelled();

    // ─── Events ───────────────────────────────────────────────────────
    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed sender,
        address indexed recipient,
        uint256 hkdAmount,
        uint256 vaultShares,
        uint64 scheduledDate,
        bool isRecurring
    );
    event ScheduleExecuted(
        uint256 indexed scheduleId,
        address indexed recipient,
        uint256 phpAmount,
        uint256 yieldEarned,
        uint256 feeCharged
    );
    event ScheduleCancelled(uint256 indexed scheduleId, address indexed sender, uint256 hkdReturned);
    event RecurringRescheduled(uint256 indexed oldScheduleId, uint256 indexed newScheduleId);
    event ExchangeRateUpdated(uint256 oldRate, uint256 newRate);
    event FeeBpsUpdated(uint256 oldFee, uint256 newFee);

    // ─── Constructor ──────────────────────────────────────────────────
    constructor(
        address _hkdr,
        address _phpc,
        address _vault,
        address _treasury,
        uint256 _exchangeRate,
        uint256 _feeBps
    ) Ownable(msg.sender) {
        if (_hkdr == address(0) || _phpc == address(0) || _vault == address(0) || _treasury == address(0))
            revert ZeroAddress();
        if (_exchangeRate == 0) revert InvalidRate();
        if (_feeBps > MAX_FEE_BPS) revert InvalidFee();

        hkdr = IERC20(_hkdr);
        phpc = _phpc;
        vault = ERC4626(_vault);
        protocolTreasury = _treasury;
        exchangeRate = _exchangeRate;
        feeBps = _feeBps;
    }

    // ─── Core Functions ───────────────────────────────────────────────

    /// @notice Schedule a future remittance — deposits HKDR into vault
    function scheduleRemittance(
        address recipient,
        uint256 hkdAmount,
        uint64 scheduledDate,
        bool isRecurring,
        uint8 recurringDay
    ) external nonReentrant returns (uint256 scheduleId) {
        if (recipient == address(0)) revert ZeroAddress();
        if (hkdAmount == 0) revert ZeroAmount();
        if (scheduledDate <= block.timestamp) revert InvalidDate();
        if (isRecurring && (recurringDay == 0 || recurringDay > 28)) revert InvalidDay();

        // Transfer HKDR from user to this contract, then deposit into vault
        hkdr.safeTransferFrom(msg.sender, address(this), hkdAmount);
        hkdr.approve(address(vault), hkdAmount);
        uint256 shares = vault.deposit(hkdAmount, address(this));

        scheduleId = nextScheduleId;
        unchecked { ++nextScheduleId; }

        schedules[scheduleId] = ScheduledTransfer({
            sender: msg.sender,
            recipient: recipient,
            hkdAmount: hkdAmount,
            vaultShares: shares,
            scheduledDate: scheduledDate,
            createdAt: uint64(block.timestamp),
            isRecurring: isRecurring,
            recurringDay: recurringDay,
            status: Status.Scheduled
        });

        emit ScheduleCreated(scheduleId, msg.sender, recipient, hkdAmount, shares, scheduledDate, isRecurring);
    }

    /// @notice Execute a scheduled remittance (callable by anyone — keeper pattern)
    function executeRemittance(uint256 scheduleId) external nonReentrant {
        if (scheduleId >= nextScheduleId) revert ScheduleNotFound();
        ScheduledTransfer storage s = schedules[scheduleId];
        if (s.status != Status.Scheduled) revert AlreadyExecutedOrCancelled();
        if (block.timestamp < s.scheduledDate) revert TooEarly();

        // Withdraw from vault
        uint256 withdrawnAmount = vault.redeem(s.vaultShares, address(this), address(this));

        // Calculate yield and fee
        uint256 originalDeposit = s.hkdAmount;
        uint256 yieldAmount = withdrawnAmount > originalDeposit ? withdrawnAmount - originalDeposit : 0;

        uint256 userYield = (yieldAmount * USER_YIELD_SHARE) / 100;
        uint256 protocolYield = yieldAmount - userYield;

        // Base fee
        uint256 baseFee = (originalDeposit * feeBps) / 10_000;

        // Effective fee after yield offset
        uint256 effectiveFee;
        uint256 bonusToRecipient;
        if (userYield >= baseFee) {
            effectiveFee = 0;
            bonusToRecipient = userYield - baseFee;
        } else {
            effectiveFee = baseFee - userYield;
            bonusToRecipient = 0;
        }

        // Net HKD for conversion
        uint256 netHkd = originalDeposit - effectiveFee + bonusToRecipient;

        // Convert to PHP
        uint256 phpAmount = (netHkd * exchangeRate) / 1e6;

        // Update state
        s.status = Status.Executed;

        emit ScheduleExecuted(scheduleId, s.recipient, phpAmount, yieldAmount, effectiveFee);

        // Transfer protocol yield + fee to treasury
        uint256 treasuryAmount = protocolYield + effectiveFee;
        if (treasuryAmount > 0) {
            hkdr.safeTransfer(protocolTreasury, treasuryAmount);
        }

        // Mint PHPC to recipient
        IScheduledMintable(phpc).mint(s.recipient, phpAmount);

        // Handle recurring: create next schedule
        if (s.isRecurring) {
            _createNextRecurring(scheduleId, s);
        }
    }

    /// @notice Cancel a scheduled remittance — returns HKDR (including earned yield) to sender
    function cancelSchedule(uint256 scheduleId) external nonReentrant {
        if (scheduleId >= nextScheduleId) revert ScheduleNotFound();
        ScheduledTransfer storage s = schedules[scheduleId];
        if (s.sender != msg.sender) revert NotSender();
        if (s.status != Status.Scheduled) revert AlreadyExecutedOrCancelled();

        // Withdraw from vault
        uint256 withdrawnAmount = vault.redeem(s.vaultShares, address(this), address(this));

        // User gets their deposit + their share of yield
        uint256 yieldAmount = withdrawnAmount > s.hkdAmount ? withdrawnAmount - s.hkdAmount : 0;
        uint256 userYield = (yieldAmount * USER_YIELD_SHARE) / 100;
        uint256 protocolYield = yieldAmount - userYield;
        uint256 userReturn = s.hkdAmount + userYield;

        s.status = Status.Cancelled;

        emit ScheduleCancelled(scheduleId, s.sender, userReturn);

        // Transfer protocol yield to treasury
        if (protocolYield > 0) {
            hkdr.safeTransfer(protocolTreasury, protocolYield);
        }

        // Return HKDR to sender
        hkdr.safeTransfer(s.sender, userReturn);
    }

    // ─── View Functions ───────────────────────────────────────────────

    /// @notice Get a quote for a scheduled remittance — current vault value, estimated yield, fee discount
    function getScheduleQuote(uint256 scheduleId) external view returns (
        uint256 currentValue,
        uint256 estimatedYield,
        uint256 baseFee,
        uint256 effectiveFee,
        uint256 estimatedPhp
    ) {
        if (scheduleId >= nextScheduleId) revert ScheduleNotFound();
        ScheduledTransfer storage s = schedules[scheduleId];

        currentValue = vault.convertToAssets(s.vaultShares);
        estimatedYield = currentValue > s.hkdAmount ? currentValue - s.hkdAmount : 0;

        uint256 userYield = (estimatedYield * USER_YIELD_SHARE) / 100;
        baseFee = (s.hkdAmount * feeBps) / 10_000;

        uint256 bonus;
        if (userYield >= baseFee) {
            effectiveFee = 0;
            bonus = userYield - baseFee;
        } else {
            effectiveFee = baseFee - userYield;
            bonus = 0;
        }

        uint256 netHkd = s.hkdAmount - effectiveFee + bonus;
        estimatedPhp = (netHkd * exchangeRate) / 1e6;
    }

    // ─── Admin Functions ──────────────────────────────────────────────

    function setExchangeRate(uint256 newRate) external onlyOwner {
        if (newRate == 0) revert InvalidRate();
        emit ExchangeRateUpdated(exchangeRate, newRate);
        exchangeRate = newRate;
    }

    function setFeeBps(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > MAX_FEE_BPS) revert InvalidFee();
        emit FeeBpsUpdated(feeBps, newFeeBps);
        feeBps = newFeeBps;
    }

    function setProtocolTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert ZeroAddress();
        protocolTreasury = _treasury;
    }

    // ─── Internal ─────────────────────────────────────────────────────

    function _createNextRecurring(uint256 oldScheduleId, ScheduledTransfer storage s) internal {
        // Calculate next month's date (simplified: add ~30 days)
        // uint64 nextDate = s.scheduledDate + 30 days; // Used in production

        // This is a simplified recurring — real implementation would calculate exact calendar day
        // For demo purposes, the sender needs to have already approved enough HKDR
        // In production, this would use a keeper + separate funding mechanism

        emit RecurringRescheduled(oldScheduleId, nextScheduleId);
        // Note: actual recurring deposit requires user to have pre-approved additional HKDR
        // For the demo, we just emit the event. Real implementation would pull from user wallet.
    }
}
