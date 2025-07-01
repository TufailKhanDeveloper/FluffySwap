import { parseAbi } from 'viem';

// Contract addresses with environment variable fallbacks
export const CONTRACTS = {
  MyToken: (import.meta.env.VITE_MY_TOKEN_ADDRESS || '0x02a9fc62de4a523c16a0f056a1db92b3cef10a58') as `0x${string}`,
  FluffySwap: (import.meta.env.VITE_FLUFFY_SWAP_ADDRESS || '0xcf9857622dc4bdf71b1cdbbc7d3ad9215027afc6') as `0x${string}`,
} as const;

// Validate contract addresses
Object.entries(CONTRACTS).forEach(([name, address]) => {
  if (!address || address === '0x' || address.length !== 42) {
    console.error(`❌ Invalid contract address for ${name}: ${address}`);
  } else {
    console.log(`✅ ${name} contract: ${address}`);
  }
});

// Enhanced ABI with proper error handling
export const MY_TOKEN_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  
  // Owner functions
  'function mint(address to, uint256 amount)',
  'function burn(uint256 amount)',
  'function owner() view returns (address)',
]);

export const FLUFFY_SWAP_ABI = parseAbi([
  'function flufToken() view returns (address)',
  'function tokensPerEth() view returns (uint256)',
  'function owner() view returns (address)',
  'function swapEthForTokens() payable',
  'function getTokenBalance() view returns (uint256)',
  'function getEthBalance() view returns (uint256)',
  'function calculateTokenAmount(uint256 ethAmount) view returns (uint256)',
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

// Network configuration
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

// Faucet links
export const FAUCET_LINKS = {
  sepolia: 'https://sepoliafaucet.com/',
  goerli: 'https://goerlifaucet.com/',
  mumbai: 'https://faucet.polygon.technology/',
  'binance-testnet': 'https://testnet.bnbchain.org/faucet-smart',
} as const;

// Swap configuration
export const SWAP_LIMITS = {
  MIN_ETH: '0.001',
  MAX_ETH: '10',
  minEthAmount: 0.001,
  maxEthAmount: 10,
  minTokenAmount: 1,
  maxTokenAmount: 1_000_000,
  slippageTolerance: 0.5,
} as const;

// Token metadata
export const TOKEN_METADATA = {
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    icon: '⟠',
  },
  FLUF: {
    name: 'FluffyToken',
    symbol: 'FLUF',
    decimals: 18,
    icon: '🧸',
  },
} as const;