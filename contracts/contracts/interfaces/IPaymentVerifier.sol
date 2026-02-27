// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IPaymentVerifier - Interface for off-chain payment verification
/// @notice Abstraction for verifying FPS (or other fiat) payments on-chain
interface IPaymentVerifier {
    /// @notice Verify/confirm a payment (called by operator after off-chain confirmation)
    /// @param paymentRef Unique reference for the payment (e.g. FPS reference number hash)
    /// @param amount Payment amount in stablecoin units (18 decimals)
    /// @param payer Address of the payer
    /// @return success Whether the verification was recorded
    function verifyPayment(bytes32 paymentRef, uint256 amount, address payer) external returns (bool success);

    /// @notice Check if a payment has been verified
    /// @param paymentRef Payment reference to check
    /// @return Whether the payment is verified
    function isPaymentVerified(bytes32 paymentRef) external view returns (bool);
}
