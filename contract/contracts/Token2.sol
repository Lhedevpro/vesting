// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token2 is ERC20 {
    constructor() ERC20("Token Test 2", "TT2") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
} 