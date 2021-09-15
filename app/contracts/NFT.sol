// SPDX-License-identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ECR721/ECR721.sol";
import "@openzeppelin/contracts/token/ECR721/extensions/ECR721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ECR721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(adress marketplaceAddress) ERC721("Ayekilua Token","AYEKI") {
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}