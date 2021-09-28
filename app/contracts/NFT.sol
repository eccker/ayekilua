//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "base64-sol/base64.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    uint256 public tokenCounter;

    event CreatedNFT(uint256 indexed tokenId, string tokenURI);

    constructor(address marketplaceAddress)
        ERC721("Ayekiluas NFT", "AYEKILUAS")
    {
        contractAddress = marketplaceAddress;
        tokenCounter = 0;
    }

    function createSVGNFT(string memory _params) public returns (uint256) {
        tokenCounter = tokenCounter + 1;
        // TODO decode params to modify ayekilua
        string memory _svg = generateAyekiluaSVG(tokenCounter);

        _mint(msg.sender, tokenCounter);
        string memory imageURI = svgToImageURI(_svg);
        string memory tokenURI = formatTokenURI(imageURI);
        _setTokenURI(tokenCounter, tokenURI);
        setApprovalForAll(contractAddress, true);
        emit CreatedNFT(tokenCounter, tokenURI);
        return tokenCounter;
    }

    function generateAyekiluaSVG(uint256 tokenId) public pure returns (string memory _generatedSVG ) {
        return string(
            abi.encodePacked(
                '<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" height="361.44495" width="192.72192" version="1.1" viewBox="0 0 200.72193 381.44496" id="ayekilua_svg">',
                '<defs id="defs4">',
                '<style id="styleSVG">',
                '.ayekiluaSVGColor {fill: #f36;}',
                'body {fill: #fff;}',
                '</style>',
                '</defs>',
                '<title id="ayekiluaTitle">Ayekilua ', uint2str(tokenId),'</title>',
                '<path id="ayekiluaSVGPath" class="ayekiluaSVGColor" ',
                'd="m 157.13,189.17068 c 13.02162,-4.25788 35.38,0.37736 35.52323,16.93884 -2.69368,14.85707 -20.5296,15.6231 -31.01995,22.71957 -16.14218,11.64052 -5.54995,33.26293 -4.85824,49.30176 1.86077,23.12114 -15.69726,43.94754 -10.5446,67.28104 3.56622,8.37325 0.41726,23.23412 -9.41055,11.58613 -5.25331,-15.83675 -6.18183,-33.27641 -18.28826,-46.33392 -11.17981,-16.06915 -23.191867,-33.10933 -24.217663,-53.36193 -5.194231,-20.71536 -25.607472,-31.75304 -43.3084,-40.50874 -12.269794,-6.60749 -14.270109,-35.25778 4.763866,-30.12644 11.038656,8.52802 26.354518,-4.13829 16.699387,-15.70553 6.650739,-13.41379 -5.985235,-33.00239 -17.073531,-15.27902 -13.002162,10.16461 -30.643116,16.08126 -46.959159,11.40197 -10.3266369,-15.8034 19.898667,-31.86442 29.019032,-16.18264 16.750703,7.63792 31.780788,-6.68209 38.054265,-21.02126 3.370971,-8.99172 20.092623,-14.1882 15.327956,0.74465 -5.529948,14.37204 -16.222175,28.42034 -12.408604,44.64765 2.106741,8.82957 24.667971,30.70956 4.226564,29.11773 -11.057883,-5.93998 -32.934054,-30.71214 -39.354105,-7.23445 2.963264,20.20029 24.854906,28.47695 41.74267,34.39319 8.230764,6.98172 24.194622,1.3157 11.24083,-7.92672 -9.272761,-10.09977 -27.773202,-8.50639 -34.009826,-21.19298 17.880271,0.0303 30.756552,18.30797 45.922208,26.81195 17.61989,13.01756 -0.86581,29.65183 -0.0704,44.93986 -2.63369,7.8894 10.45348,30.03204 14.30543,16.87005 -0.91326,-6.25535 -4.41381,-18.74993 -0.30158,-5.34487 3.74918,17.47143 7.08861,35.4626 15.99216,51.20001 11.85191,-19.23274 2.13566,-41.87272 0.0346,-62.33543 -3.65966,-19.23824 -2.69172,-39.44369 -9.93703,-57.91879 2.4698,-13.3617 31.57689,-8.35705 30.27843,-10.91311 -17.86478,-2.70786 -24.58764,30.52943 -2.9795,22.9596 13.66634,-4.36148 28.36787,-12.7746 32.5178,-27.48107 -4.89167,-15.59844 -23.26072,-9.93155 -34.51131,-5.67069 -13.52796,8.46719 -28.17388,-5.59277 -16.48206,-17.94419 8.19289,-12.48087 -6.24461,-28.43625 0.6523,-42.39032 10.01798,-10.97469 -0.2908,-27.78552 -10.7894,-34.35546 -14.15681,-5.369493 -31.152973,-6.999144 -45.783934,-3.5976 -15.332028,7.72881 -12.677679,28.15262 -25.505146,38.20892 -13.4095,11.36278 4.194345,-13.09003 4.989489,-19.81943 3.55228,-10.66883 9.882006,-20.373223 13.31239,-30.890903 C 76.343552,67.141558 64.271081,48.458862 46.79032,44.342912 35.95249,35.240406 54.456176,31.461781 59.836561,38.486766 73.497465,38.913621 96.72912,24.283868 90.591425,10.172781 86.341646,2.010515 94.79274,-4.813746 97.623874,6.5248923 102.92421,21.901149 124.3196,38.596234 137.6279,21.753404 c 3.44784,-8.41674 26.88892,-25.1799648 23.05623,-6.579367 -2.7805,16.768906 17.86813,-7.3925843 20.72005,10.322871 13.0976,21.600364 -17.55856,24.214964 -25.29463,39.196184 -10.58478,10.251747 1.1621,29.862154 -11.26071,37.259508 -11.43408,2.27448 2.09436,23.52172 9.85622,27.94728 11.66044,6.8529 31.18787,-2.67905 34.42955,16.96921 5.89272,10.17851 -14.89844,17.29081 -6.55007,4.16904 -7.29032,-8.45981 -23.83487,-11.7826 -33.76726,-10.93395 -7.76879,12.99402 1.72419,30.36119 4.71342,44.04286 1.06096,1.76904 2.2882,3.43325 3.5993,5.02364 z" />',
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

        string memory _imageURI = string(
            abi.encodePacked(baseURL, svgBase64Encoded)
        );
        return _imageURI;
    }

    function formatTokenURI(string memory _imageURI)
        public
        pure
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
                                '{"name": "Ayekilua NFT", ',
                                '"description": "This is a unique Ayekilua NFT generated by webapp", ',
                                '"attributes":"", ',
                                '"image": "',
                                _imageURI,
                                '"}'
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

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}
