// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MockHKDR - Mock Hong Kong Dollar Stablecoin
/// @notice Test token for RemicoPay demo on Etherlink Testnet
/// @dev Public faucet mint for demo purposes - NOT for production
contract MockHKDR is ERC20 {
    uint256 public constant FAUCET_AMOUNT = 10_000 * 1e18; // 10,000 HKDR per claim
    uint256 public constant FAUCET_COOLDOWN = 1 hours;

    mapping(address => uint256) public lastFaucetClaim;

    error FaucetCooldown(uint256 availableAt);

    event FaucetClaimed(address indexed user, uint256 amount);

    constructor() ERC20("Mock HKD Stablecoin", "HKDR") {
        // Mint initial supply to deployer for liquidity
        _mint(msg.sender, 1_000_000 * 1e18);
    }

    /// @notice Claim test HKDR tokens (faucet for demo)
    function faucet() external {
        if (block.timestamp < lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN) {
            revert FaucetCooldown(lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN);
        }

        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }
}
