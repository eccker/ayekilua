//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    // The owner of the contract is first minted with the total supply 
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 21000000 * (10 ** 18));
    }
}
