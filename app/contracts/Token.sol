//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 21000000 * (10 ** 18));
    }
}

// contract Token {
//   string public name = "Ayekilua Token";
//   string public symbol = "AYEKI";
//   uint public totalSupply = 21000000;
//   mapping(address => uint) balances;

//   constructor() {
//     balances[msg.sender] = totalSupply;
//   }

//   function transfer(address to, uint amount) external {
//     require(balances[msg.sender] >= amount, "Not enough tokens");
//     balances[msg.sender] -= amount;
//     balances[to] += amount;
//   }

//   function balanceOf(address account) external view returns (uint) {
//     return balances[account];
//   }
// }