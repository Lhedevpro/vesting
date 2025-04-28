// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vesting {
    struct VestingInfo {
        uint256 amount;
        uint256 unlockTime;
        bool claimed;
        IERC20 token;
    }

    address public immutable _owner;
    mapping(address => VestingInfo) public vestings;
    mapping(address => bool) public whitelist;

    constructor() {
        _owner = msg.sender;
        whitelist[msg.sender] = true; // Owner ajouté par défaut
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Not authorized");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }

    function addAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Invalid address");
        whitelist[admin] = true;
    }

    function removeAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Invalid address");
        whitelist[admin] = false;
    }

    function addVesting(address beneficiary, uint256 amount, uint256 unlockTime, address tokenAddress) external onlyWhitelisted {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(unlockTime > block.timestamp, "Unlock time must be in the future");

        vestings[beneficiary] = VestingInfo({
            amount: amount,
            unlockTime: unlockTime,
            claimed: false,
            token: IERC20(tokenAddress)
        });
    }

    function claimTokens() external {
        VestingInfo storage userVesting = vestings[msg.sender];

        require(userVesting.amount > 0, "No tokens to claim");
        require(!userVesting.claimed, "Already claimed");
        require(block.timestamp >= userVesting.unlockTime, "Tokens are still locked");

        userVesting.claimed = true;
        require(userVesting.token.transfer(msg.sender, userVesting.amount), "Transfer failed");
    }
}
