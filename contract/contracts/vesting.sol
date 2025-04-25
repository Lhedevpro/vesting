// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vesting {
    struct VestingInfo {
        uint256 amount;
        uint256 unlockTime;
        bool claimed;
    }

    address public immutable _owner;
    IERC20 public immutable token;
    mapping(address => VestingInfo) public vestings;

    constructor(address tokenAddress) {
        _owner = msg.sender;
        token = IERC20(tokenAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Not authorized");
        _;
    }

    function addVesting(address beneficiary, uint256 amount, uint256 unlockTime) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(unlockTime > block.timestamp, "Unlock time must be in the future");

        vestings[beneficiary] = VestingInfo({
            amount: amount,
            unlockTime: unlockTime,
            claimed: false
        });
    }

    function claimTokens() external {
        VestingInfo storage userVesting = vestings[msg.sender];

        require(userVesting.amount > 0, "No tokens to claim");
        require(!userVesting.claimed, "Already claimed");
        require(block.timestamp >= userVesting.unlockTime, "Tokens are still locked");

        userVesting.claimed = true;
        require(token.transfer(msg.sender, userVesting.amount), "Transfer failed");
    }
}
