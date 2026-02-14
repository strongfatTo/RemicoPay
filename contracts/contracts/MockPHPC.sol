// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MockPHPC - Mock Philippine Peso Stablecoin
/// @notice Test token for RemicoPay demo on Etherlink Testnet
/// @dev Only authorized minter (RemicoPay contract) can mint
contract MockPHPC is ERC20, Ownable {
    address public minter;

    error OnlyMinter();
    error ZeroAddress();

    event MinterUpdated(address indexed oldMinter, address indexed newMinter);

    constructor() ERC20("Mock PHP Stablecoin", "PHPC") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1_000_000 * 1e18);
    }

    /// @notice Set the authorized minter (RemicoPay contract)
    /// @param _minter Address of the RemicoPay contract
    function setMinter(address _minter) external onlyOwner {
        if (_minter == address(0)) revert ZeroAddress();
        address oldMinter = minter;
        minter = _minter;
        emit MinterUpdated(oldMinter, _minter);
    }

    /// @notice Mint PHPC to recipient (only callable by minter)
    /// @param to Recipient address
    /// @param amount Amount to mint
    function mint(address to, uint256 amount) external {
        if (msg.sender != minter) revert OnlyMinter();
        _mint(to, amount);
    }
}
