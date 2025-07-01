// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken (FLUF)
 * @dev ERC20 token for FluffySwap DEX
 */
contract MyToken is ERC20, Ownable {
    uint8 private _decimals;
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply,
        address owner
    ) ERC20(name, symbol) Ownable(owner) {
        _decimals = decimals_;
        _mint(owner, initialSupply * 10**decimals_);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mint new tokens (only owner)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens from caller's balance
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}