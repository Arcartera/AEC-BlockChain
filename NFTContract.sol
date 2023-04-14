// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTContract is ERC721, Ownable {
    IERC20 public token;

    uint public price;
    uint public tokenDecimal = 18;
    uint public tokenId = 0; 
    address private tokenReceiver = 0x815A5A61668cEf55DC11a23902146192E4413ac7;

    mapping (uint => string) private _tokenURIs;
    mapping (address => uint) private _buyCount;

    constructor(string memory name, string memory symbol, address _tokenAddress, uint _price) ERC721(name, symbol) {
        token = IERC20(_tokenAddress);
        price = _price * (10 ** tokenDecimal);
    }

    function buy() external {
        require(token.balanceOf(msg.sender) >= price, "Not enough tokens");
        require(token.allowance(msg.sender, address(this)) >= price, "Token allowance too low");

        token.transferFrom(msg.sender, address(this), price);
        _buyCount[msg.sender]++;
    }

    function mint(string memory _tokenURI) external {
        require(bytes(_tokenURI).length > 0, "Token URI is empty");
        require(!_exists(tokenId), "Token already minted");
        require(_buyCount[msg.sender] > 0, "You must pay the minting fee: see buy()");

        _buyCount[msg.sender]--;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        tokenId++;
    }

    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal virtual {
        require(_exists(_tokenId), "URI set of nonexistent token");
        _tokenURIs[_tokenId] = _tokenURI;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[_tokenId];
        return _tokenURI;
    }

    function withdrawTokens(uint256 amount) public onlyOwner{
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance");
        token.transfer(tokenReceiver, amount);
    }

    function getBuyCount(address buyer) external view returns (uint) {
        return _buyCount[buyer];
    }
}
