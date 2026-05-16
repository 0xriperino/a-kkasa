// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Test-only mock. Production uses Monad testnet USDC at 0x534b2f3A21130d7a60830c2Df862319e593943A3
contract MockUSDC is ERC20, Ownable {
    uint8 private constant _DECIMALS = 6;
    uint256 public constant FAUCET_AMOUNT = 1000 * 10 ** _DECIMALS;
    uint256 public constant FAUCET_COOLDOWN = 1 hours;

    mapping(address => uint256) public lastFaucetCall;

    constructor() ERC20("Mock USDC", "mUSDC") Ownable(msg.sender) {}

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    function faucet() external {
        require(
            block.timestamp >= lastFaucetCall[msg.sender] + FAUCET_COOLDOWN,
            "Faucet: 1 saat beklemelisiniz"
        );
        lastFaucetCall[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
