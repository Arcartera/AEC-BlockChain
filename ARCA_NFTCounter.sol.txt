// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTCounter {
    // Arcartera Protocol token contract address
    address public arcarteraTokenAddress = 0x25F1bD9E22e4c517f75eEA15977264132d74D9e8;

    // Function to get the total number of NFTs minted by Arcartera Protocol
    function getTotalNFTs() external view returns (uint256) {
        // Create an interface instance for the Arcartera Protocol ERC721 contract
        IERC721 arcarteraTokenContract = IERC721(arcarteraTokenAddress);
        
        // Get the total supply of NFTs minted by the Arcartera Protocol contract
        uint256 totalNFTs = arcarteraTokenContract.totalSupply();
        
        // Return the total number of NFTs
        return totalNFTs;
    }
}
