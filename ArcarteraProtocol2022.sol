// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Arcartera Protocol Token (ARCA)
 * @dev ERC20 token implementation with a max total supply of 88 billion tokens and 18 decimals.
 */
contract ArcarteraProtocolToken is ERC20 {
    constructor() ERC20("Arcartera Protocol", "ARCA") {
        uint256 totalSupply = 88000000000 * (10 ** uint256(decimals()));
        _mint(msg.sender, totalSupply);
    }
}