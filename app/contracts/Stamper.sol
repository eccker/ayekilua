//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Stamper {
    string private stamp;

    constructor(string memory _stamp) {
        stamp = _stamp;
    }

    function getStamp() public view returns (string memory) {
        return stamp;
    }

    function setStamp(string memory _stamp) public {
        stamp = _stamp;
    }
}
