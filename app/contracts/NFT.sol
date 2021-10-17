//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


import "base64-sol/base64.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage, VRFConsumerBase, Ownable  {
    // using Counters for Counters.Counter;
    // Counters.Counter private _tokenIds;
    address contractAddress;
    // address payable public owner;

    uint256 public tokenCounter;

    bytes32 public keyHash;
    uint256 public fee;
    uint256 public price;

    // bytes32 public g_requestId;

    string[] public bases;
    string[] public eyes;
    string[] public mouths;
    

    mapping(bytes32 => address) public requestIdToSender;
    mapping(bytes32 => uint256) public requestIdToToken;
    mapping(uint256 => uint256) public tokenIdToRandomNumber;
    // mapping(uint256 => bytes32) public tokekIdToRequestId;


    // mapping(bytes32 => string) public requestIdToSender_d_params;
    // mapping(bytes32 => string) public requestIdToSender_svgname;
    // mapping(bytes32 => string) public requestIdToSender_description;
    // mapping(bytes32 => string) public requestIdToSender_color;


    // event CreatedNFT(uint256 indexed tokenId, string tokenURI);
    event CreatedUnfinishedRandomSVG(uint256 indexed tokenId, uint256 random);
    event CreatedRandomSVG(uint256 indexed tokenId, string svg );
    event requestedRandomSVG(bytes32 indexed requestId, uint256 indexed tokenId);

    constructor(address marketplaceAddress, address _VRFCoordinator, address _LinkToken, bytes32 _keyHash, uint256 _fee )  VRFConsumerBase(
            _VRFCoordinator, // VRF Coordinator
            _LinkToken  // LINK Token
        )
        ERC721("Ayekiluas NFT", "AYEKILUAS")
    {
        contractAddress = marketplaceAddress;
        tokenCounter = 0;
        keyHash = _keyHash;
        fee = _fee;
        // owner = payable(msg.sender);
        //    1.000000000000000000
        price =  25000000000000000;
        bases = ["axolotl", "axolotl", "salamandra", "ajolote", "salamandra", "ajolote","salamandra", "ajolote", "salamandra", "ajolote", "xolotl", "xolotl", "salamandra", "ajolote", "salamandra", "ajolote", "salamandra", "ajolote", "ajolote", "mexolotl", "mexolotl","salamandra", "ajolote", "salamandra", "ajolote", "salamandra", "ajolote", "ajolote", "salamandra", "salamandra", "ambystoma mexicanum"];
        eyes = ["big", "small", "large", "flirty", "seductor"];
        mouths = ["smily","sad","open", "flat", "lips bite", "kiss"];
    }

    // modifier onlyOwner(){
    //     require(msg.sender == owner, "not owner");
    //     _;
    // }

    function withdraw() public payable onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // function getTokenIdFromRequestId(bytes32 _requestId) public view returns (uint256){
    //     return requestIdToToken[_requestId];
    // }


    function create() public payable returns (bytes32 requestId){
        // TODO decode params to modify ayekilua
        require(msg.value >= price, "Need to seend 0.025 coins");
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK in the contract address to process randomness requests.");
        
        requestId = requestRandomness(keyHash, fee);

        // requestIdToSender_d_params[requestId] = _d_params; 
        // requestIdToSender_svgname[requestId] = _name;
        // requestIdToSender_description[requestId] = _description;
        // requestIdToSender_color[requestId] = _color;
        requestIdToSender[requestId] = msg.sender;
        requestIdToToken[requestId] = tokenCounter;
        uint256 tokenId = tokenCounter;
        // tokekIdToRequestId[tokenId] = requestId;
        tokenCounter = tokenCounter + 1;
        
        emit requestedRandomSVG(requestId, tokenId);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 _requestId, uint256 randomness) internal override {
        address nftOwner = requestIdToSender[_requestId];
        uint256 tokenId = requestIdToToken[_requestId];
        _safeMint(nftOwner, tokenId);
        tokenIdToRandomNumber[tokenId] = randomness;
        emit CreatedUnfinishedRandomSVG(tokenId, randomness);
    }

    function finishMint(uint256 tokenId, string memory _d_params, string memory _svgname, string memory _description, string memory _color) public {
        require(bytes(tokenURI(tokenId)).length <= 0, "tokenURI is already set!"); 
        require(tokenCounter > tokenId, "TokenId has not been minted yet!");
        require(tokenIdToRandomNumber[tokenId] > 0, "Need to wait for the Chainlink node to respond!");
        uint256 randomNumber = tokenIdToRandomNumber[tokenId];
        // bytes32 _requestId = tokekIdToRequestId[tokenId];
        string memory svg = generateAyekiluaSVG(tokenId, _d_params, _svgname, _description, _color, randomNumber);
        string memory imageURI = svgToImageURI(svg);
        string memory tokenURI = formatTokenURI(imageURI, tokenId, _svgname, _description, randomNumber);
        _setTokenURI(tokenId, tokenURI);
        setApprovalForAll(contractAddress, true);
        emit CreatedRandomSVG(tokenId, svg);
    }


    //    function createSVGNFT(string memory _d_params, string memory _name, string memory _description,string memory color) public returns (uint256) {
    // function createSVGNFT(uint256 _random) public returns (uint256) {
    //     string memory _svg = generateAyekiluaSVG(requestIdToToken[_requestId], requestIdToSender_d_params[_requestId], requestIdToSender_svgname[_requestId], requestIdToSender_description[_requestId], requestIdToSender_color[_requestId], _random);
    //     _mint(requestIdToSender[_requestId], requestIdToToken[_requestId]);
    //     string memory imageURI = svgToImageURI(_svg);
    //     string memory tokenURI = formatTokenURI(imageURI, requestIdToToken[_requestId], requestIdToSender_svgname[_requestId], requestIdToSender_description[_requestId], _random);
    //     _setTokenURI(requestIdToToken[_requestId], tokenURI);
    //     setApprovalForAll(contractAddress, true);
    //     emit CreatedNFT(requestIdToToken[_requestId], tokenURI);
    //     return requestIdToToken[_requestId];
    // }

    function generateAyekiluaSVG(uint256 tokenId, string memory _d_params, string memory _name, string memory _description, string memory _color, uint256 _random) public pure returns (string memory _generatedSVG ) {
        return string(
            abi.encodePacked(
                '<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" height="350" width="350" version="1.1" viewBox="0 0 175 350" id="ayekilua_svg">',
                '<defs id="defs4">',
                '<style id="styleSVG">',
                '.ayekiluaSVGColor {fill: #',_color,';}',
                'body {fill: #fff;}',
                '</style>',
                '</defs>',
                '<desc>',_description,' ',uint2str(_random),'</desc>',
                '<title id="ayekiluaTitle">Ayekilua #',uint2str(tokenId),': ',_name,'</title>',
                '<path id="ayekiluaSVGPath" class="ayekiluaSVGColor" ',
                // TODO generate approximated path by adding perlin noise
                'd="', _d_params,'" />',
                '</svg>'
            )
        );
    }

    function svgToImageURI(string memory _svg)
        public
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(_svg)))
        );

        return string(
            abi.encodePacked(baseURL, svgBase64Encoded)
        );
    }

    function formatTokenURI(string memory _imageURI, uint256 tokenID, string memory _name, string memory _description, uint256 _random)
        public
        view
        returns (string memory)
    {
        string memory baseURL = "data:application/json;base64,";
        return
            string(
                abi.encodePacked(
                    baseURL,
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "Ayekiluas #', uint2str(tokenID),'. ', _name,'", ',
                                '"description": "This is a unique blockchain generated NFT. Ayekiluas Series. ', _description,' ", ',
                                '"attributes": [',
                                    '{',
                                        '  "trait_type": "Base", ',
                                        '  "value": "', bases[_random % bases.length],'"',
                                    '}, ',
                                    '{',
                                        '  "trait_type": "Eyes", ',
                                        '  "value": "', eyes[_random % eyes.length],'"',
                                    '}, ',
                                    '{',
                                        '  "trait_type": "Mouth", ',
                                        '  "value": "', mouths[_random % mouths.length],'"',
                                    '}',
                                    // '{',
                                    //     '  "trait_type": "Level", ',
                                    //     '  "value": ',uint2str(uint256(keccak256(abi.encode(_random, levelsMax + 1 ))) % levelsMax),
                                    // '}, ',
                                    // '{',
                                    //     '  "trait_type": "Personality", ',
                                    //     '  "value": "', personalities[_random % personalities.length],'"',
                                    // '}, ',
                                    // '{',
                                    //     '  "display_type": "boost_number", ',
                                    //     '  "trait_type": "Aqua Power", ',
                                    //     '  "value": ',uint2str(uint256(keccak256(abi.encode(_random, aquaPowerMax        + 1 ))) % aquaPowerMax),
                                    // '}, ',
                                    // '{',
                                    //     '  "display_type": "number", ',
                                    //     '  "trait_type": "Generation", ',
                                    //     '  "value": ',uint2str(uint256(keccak256(abi.encode(_random, generationMax       + 1 ))) % generationMax),
                                    // '}',
                                    '],',
                                '"image": "', _imageURI,'"}'
                            )
                        )
                    )
                )
            );
    }

     function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
      if (_i == 0) {
          return "0";
      }
      uint j = _i;
      uint len;
      while (j != 0) {
          len++;
          j /= 10;
      }
      bytes memory bstr = new bytes(len);
      uint k = len;
      while (_i != 0) {
          k = k-1;
          uint8 temp = (48 + uint8(_i - _i / 10 * 10));
          bytes1 b1 = bytes1(temp);
          bstr[k] = b1;
          _i /= 10;
      }
      return string(bstr);
  }
}
