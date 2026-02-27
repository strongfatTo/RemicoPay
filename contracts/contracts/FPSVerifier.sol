// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IPaymentVerifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title FPSVerifier - Semi-automatic FPS payment verification
/// @notice Authorized operator confirms FPS receipt off-chain, then marks on-chain as verified
/// @dev Backend monitors FPS account, calls confirmPayment when funds arrive
contract FPSVerifier is IPaymentVerifier, Ownable {

    struct PaymentRecord {
        uint256 amount;
        address payer;
        uint64  confirmedAt;
        bool    verified;
    }

    mapping(bytes32 => PaymentRecord) public payments;
    mapping(address => bool) public operators;

    error OnlyOperator();
    error ZeroAddress();
    error AlreadyVerified();
    error ZeroAmount();

    event OperatorUpdated(address indexed operator, bool enabled);
    event PaymentConfirmed(bytes32 indexed paymentRef, address indexed payer, uint256 amount);

    constructor() Ownable(msg.sender) {
        // Deployer is initial operator
        operators[msg.sender] = true;
        emit OperatorUpdated(msg.sender, true);
    }

    modifier onlyOperator() {
        if (!operators[msg.sender]) revert OnlyOperator();
        _;
    }

    /// @notice Set operator authorization
    function setOperator(address _operator, bool _enabled) external onlyOwner {
        if (_operator == address(0)) revert ZeroAddress();
        operators[_operator] = _enabled;
        emit OperatorUpdated(_operator, _enabled);
    }

    /// @notice Confirm an FPS payment (called by backend operator)
    /// @dev This is the main entry point — backend calls after confirming FPS receipt
    function confirmPayment(bytes32 paymentRef, uint256 amount, address payer) external onlyOperator {
        if (amount == 0) revert ZeroAmount();
        if (payer == address(0)) revert ZeroAddress();
        if (payments[paymentRef].verified) revert AlreadyVerified();

        payments[paymentRef] = PaymentRecord({
            amount: amount,
            payer: payer,
            confirmedAt: uint64(block.timestamp),
            verified: true
        });

        emit PaymentConfirmed(paymentRef, payer, amount);
    }

    /// @inheritdoc IPaymentVerifier
    function verifyPayment(bytes32 paymentRef, uint256 amount, address payer) external override returns (bool) {
        // This is an alternative entry point that also confirms
        if (!operators[msg.sender]) revert OnlyOperator();
        if (payments[paymentRef].verified) revert AlreadyVerified();

        payments[paymentRef] = PaymentRecord({
            amount: amount,
            payer: payer,
            confirmedAt: uint64(block.timestamp),
            verified: true
        });

        emit PaymentConfirmed(paymentRef, payer, amount);
        return true;
    }

    /// @inheritdoc IPaymentVerifier
    function isPaymentVerified(bytes32 paymentRef) external view override returns (bool) {
        return payments[paymentRef].verified;
    }

    /// @notice Get full payment details
    function getPayment(bytes32 paymentRef) external view returns (PaymentRecord memory) {
        return payments[paymentRef];
    }
}
