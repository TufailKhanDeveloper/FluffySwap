import { parseAbi } from 'viem';

/**
 * Smart Contract Configuration
 * 
 * This file contains all contract addresses, ABIs, and related configuration
 * for the FluffySwap decentralized exchange.
 */

// Contract addresses with environment variable fallbacks
export const CONTRACTS = {
  MyToken: (import.meta.env.VITE_MY_TOKEN_ADDRESS || '0x02a9fc62de4a523c16a0f056a1db92b3cef10a58') as `0x${string}`,
  FluffySwap: (import.meta.env.VITE_FLUFFY_SWAP_ADDRESS || '0xcf9857622dc4bdf71b1cdbbc7d3ad9215027afc6') as `0x${string}`,
} as const;

// Validate contract addresses at runtime
Object.entries(CONTRACTS).forEach(([name, address]) => {
  if (!address || address === '0x' || address.length !== 42) {
    console.error(`❌ Invalid contract address for ${name}: ${address}`);
    throw new Error(`Invalid contract address for ${name}`);
  } else {
    console.log(`✅ ${name} contract: ${address}`);
  }
});

/**
 * ERC-20 Token ABI
 * 
 * Standard ERC-20 functions plus additional features for the FLUF token
 */
export const MY_TOKEN_ABI = parseAbi([
  // Standard ERC-20 functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  
  // Extended functions
  'function mint(address to, uint256 amount)',
  'function burn(uint256 amount)',
  'function owner() view returns (address)',
]);

/**
 * FluffySwap DEX ABI
 * 
 * Functions for the decentralized exchange contract
 */
export const FLUFFY_SWAP_ABI = parseAbi([
  // Core swap functions
  'function flufToken() view returns (address)',
  'function tokensPerEth() view returns (uint256)',
  'function owner() view returns (address)',
  'function swapEthForTokens() payable',
  
  // View functions
  'function getTokenBalance() view returns (uint256)',
  'function getEthBalance() view returns (uint256)',
  'function calculateTokenAmount(uint256 ethAmount) view returns (uint256)',
  
  // Admin functions
  'function updateRate(uint256 _tokensPerEth)',
  'function withdrawEth(uint256 amount)',
  'function withdrawTokens(uint256 amount)',
  
  // Events
  'event TokensSwapped(address indexed user, uint256 ethAmount, uint256 tokenAmount)',
  'event RateUpdated(uint256 oldRate, uint256 newRate)',
  'event EthWithdrawn(address indexed owner, uint256 amount)',
  'event TokensWithdrawn(address indexed owner, uint256 amount)',
]);

// Export alias for backward compatibility
export const FLUFFYSWAP_ABI = FLUFFY_SWAP_ABI;

/**
 * Network Configuration
 * 
 * Supported blockchain networks and their configuration
 */
export const SUPPORTED_CHAINS = {
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: [`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`] },
      public: { http: ['https://rpc.sepolia.org'] },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    testnet: true,
  },
} as const;

/**
 * External Service Links
 * 
 * Links to faucets and other external services
 */
export const FAUCET_LINKS = {
  sepolia: 'https://sepoliafaucet.com/',
  goerli: 'https://goerlifaucet.com/',
  mumbai: 'https://faucet.polygon.technology/',
  'binance-testnet': 'https://testnet.bnbchain.org/faucet-smart',
} as const;

/**
 * Swap Configuration
 * 
 * Limits and parameters for token swapping
 */
export const SWAP_LIMITS = {
  MIN_ETH: '0.001',
  MAX_ETH: '10',
  minEthAmount: 0.001,
  maxEthAmount: 10,
  minTokenAmount: 1,
  maxTokenAmount: 1_000_000,
  slippageTolerance: 0.5, // 0.5%
  gasLimitMultiplier: 1.2, // 20% buffer for gas estimation
} as const;

/**
 * Token Metadata
 * 
 * Display information for supported tokens
 */
export const TOKEN_METADATA = {
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    icon: '⟠',
    color: '#627eea',
  },
  FLUF: {
    name: 'FluffyToken',
    symbol: 'FLUF',
    decimals: 18,
    icon: '🧸',
    color: '#ec4899',
  },
} as const;

/**
 * Application Constants
 * 
 * General application configuration
 */
export const APP_CONFIG = {
  name: 'FluffySwap',
  description: 'Kawaii Decentralized Exchange',
  version: '1.2.0',
  author: 'Huzaifa Khan',
  repository: 'https://github.com/your-username/fluffyswap',
  documentation: 'https://docs.fluffyswap.dev',
  support: {
    email: 'support@fluffyswap.dev',
    discord: 'https://discord.gg/fluffyswap',
    twitter: 'https://twitter.com/fluffyswapdex',
  },
} as const;

/**
 * Error Messages
 * 
 * Standardized error messages for better UX
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  INSUFFICIENT_LIQUIDITY: 'Insufficient liquidity in the pool',
  AMOUNT_TOO_LOW: `Minimum swap amount is ${SWAP_LIMITS.MIN_ETH} ETH`,
  AMOUNT_TOO_HIGH: `Maximum swap amount is ${SWAP_LIMITS.MAX_ETH} ETH`,
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  CONTRACT_ERROR: 'Contract interaction failed. Please try again.',
} as const;

/**
 * Success Messages
 * 
 * Standardized success messages for better UX
 */
export const SUCCESS_MESSAGES = {
  SWAP_COMPLETED: 'Swap completed successfully! 🎉',
  TRANSACTION_SUBMITTED: 'Transaction submitted to the blockchain',
  WALLET_CONNECTED: 'Wallet connected successfully',
  THEME_CHANGED: 'Theme updated',
} as const;