// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FluffySwap
 * @dev Simple DEX for swapping ETH to FLUF tokens
 */
contract FluffySwap is Ownable, ReentrancyGuard {
    IERC20 public immutable flufToken;
    
    // Rate: 1 ETH = tokensPerEth FLUF tokens
    uint256 public tokensPerEth;
    
    event TokensSwapped(
        address indexed user,
        uint256 ethAmount,
        uint256 tokenAmount
    );
    
    event RateUpdated(uint256 oldRate, uint256 newRate);
    
    event EthWithdrawn(address indexed owner, uint256 amount);
    
    event TokensWithdrawn(address indexed owner, uint256 amount);
    
    constructor(
        address _flufToken,
        uint256 _tokensPerEth,
        address owner
    ) Ownable(owner) {
        require(_flufToken != address(0), "Invalid token address");
        require(_tokensPerEth > 0, "Rate must be greater than 0");
        
        flufToken = IERC20(_flufToken);
        tokensPerEth = _tokensPerEth;
    }
    
    /**
     * @dev Internal function to handle the swap logic
     */
    function _performSwap() internal {
        require(msg.value > 0, "Must send ETH");
        
        uint256 tokenAmount = (msg.value * tokensPerEth) / 1 ether;
        require(tokenAmount > 0, "Token amount must be greater than 0");
        
        uint256 contractBalance = flufToken.balanceOf(address(this));
        require(contractBalance >= tokenAmount, "Insufficient token liquidity");
        
        require(flufToken.transfer(msg.sender, tokenAmount), "Token transfer failed");
        
        emit TokensSwapped(msg.sender, msg.value, tokenAmount);
    }
    
    /**
     * @dev Swap ETH for FLUF tokens
     */
    function swapEthForTokens() external payable nonReentrant {
        _performSwap();
    }
    
    /**
     * @dev Update exchange rate (only owner)
     */
    function updateRate(uint256 _tokensPerEth) external onlyOwner {
        require(_tokensPerEth > 0, "Rate must be greater than 0");
        
        uint256 oldRate = tokensPerEth;
        tokensPerEth = _tokensPerEth;
        
        emit RateUpdated(oldRate, _tokensPerEth);
    }
    
    /**
     * @dev Withdraw ETH from contract (only owner)
     */
    function withdrawEth(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient ETH balance");
        
        payable(owner()).transfer(amount);
        emit EthWithdrawn(owner(), amount);
    }
    
    /**
     * @dev Withdraw FLUF tokens from contract (only owner)
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount <= flufToken.balanceOf(address(this)), "Insufficient token balance");
        
        require(flufToken.transfer(owner(), amount), "Token transfer failed");
        emit TokensWithdrawn(owner(), amount);
    }
    
    /**
     * @dev Get contract ETH balance
     */
    function getEthBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get contract token balance
     */
    function getTokenBalance() external view returns (uint256) {
        return flufToken.balanceOf(address(this));
    }
    
    /**
     * @dev Calculate token amount for given ETH
     */
    function calculateTokenAmount(uint256 ethAmount) external view returns (uint256) {
        if (ethAmount == 0) return 0;
        return (ethAmount * tokensPerEth) / 1 ether;
    }
    
    /**
     * @dev Fallback function to handle direct ETH transfers
     */
    receive() external payable nonReentrant {
        if (msg.value > 0) {
            _performSwap();
        }
    }
}