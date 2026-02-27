// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MockPHPC - Mock Philippine Peso Stablecoin
/// @notice Test token for RemicoPay demo on Etherlink Testnet
/// @dev Multiple authorized minters (RemicoPay, ScheduledRemittance, etc.) can mint
contract MockPHPC is ERC20, Ownable {
    mapping(address => bool) public minters;

    error OnlyMinter();
    error ZeroAddress();

    event MinterUpdated(address indexed minter, bool enabled);

    constructor() ERC20("Mock PHP Stablecoin", "PHPC") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1_000_000 * 1e18);
    }

    /// @notice Set minter authorization (multi-minter)
    /// @param _minter Address to authorize/deauthorize
    /// @param _enabled Whether to enable or disable minting
    function setMinter(address _minter, bool _enabled) external onlyOwner {
        if (_minter == address(0)) revert ZeroAddress();
        minters[_minter] = _enabled;
        emit MinterUpdated(_minter, _enabled);
    }

    /// @notice Convenience wrapper: authorize a single minter (backward compatible)
    /// @param _minter Address to authorize
    function setMinter(address _minter) external onlyOwner {
        if (_minter == address(0)) revert ZeroAddress();
        minters[_minter] = true;
        emit MinterUpdated(_minter, true);
    }

    /// @notice Mint PHPC to recipient (only callable by authorized minters)
    /// @param to Recipient address
    /// @param amount Amount to mint
    function mint(address to, uint256 amount) external {
        if (!minters[msg.sender]) revert OnlyMinter();
        _mint(to, amount);
    }
}
