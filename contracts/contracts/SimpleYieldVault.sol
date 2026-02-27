// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SimpleYieldVault - ERC-4626 Mock Vault for HKDR
/// @notice Demo vault that simulates yield via owner-injected HKDR
/// @dev Production usage: replace with real DeFi vault integration
contract SimpleYieldVault is ERC4626, Ownable {
    using SafeERC20 for IERC20;

    event YieldAdded(address indexed sender, uint256 amount, uint256 newTotalAssets);

    /// @param _hkdr Address of the MockHKDR (underlying asset)
    constructor(
        IERC20 _hkdr
    )
        ERC20("RemicoPay Yield Vault", "ryHKDR")
        ERC4626(_hkdr)
        Ownable(msg.sender)
    {}

    /// @notice Inject yield into the vault (simulates interest accrual)
    /// @dev Owner transfers HKDR into the vault, increasing share value for all depositors
    /// @param amount Amount of HKDR to inject as yield
    function addYield(uint256 amount) external onlyOwner {
        require(amount > 0, "Zero amount");
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        emit YieldAdded(msg.sender, amount, totalAssets());
    }
}
