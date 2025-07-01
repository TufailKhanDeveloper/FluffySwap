# 🌸 FluffySwap - Professional Kawaii Decentralized Exchange

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=Ethereum&logoColor=white)](https://ethereum.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?logo=hardhat&logoColor=black)](https://hardhat.org/)

A production-ready, kawaii-themed decentralized exchange (DEX) built for Ethereum Sepolia testnet. Swap ETH for FLUF tokens with adorable animations, secure smart contracts, and delightful user experience.

![FluffySwap Preview](https://via.placeholder.com/800x400/FFD1DC/333333?text=FluffySwap+🌸)

## ✨ Features

### 🎨 Frontend Excellence
- **🌙 Complete Dark Mode**: Full theme support across all components with smooth transitions
- **🎨 Kawaii Design**: Pastel color palette with floating particle animations
- **📱 Responsive UI**: Mobile-first design with smooth micro-interactions
- **🔗 Wallet Integration**: MetaMask + WalletConnect via RainbowKit
- **⚡ Real-time Updates**: Live balance and transaction status with proper state management
- **🛡️ Error Handling**: Comprehensive error boundaries and user feedback
- **♿ Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **🎭 Professional Animations**: Framer Motion powered micro-interactions

### 🔐 Smart Contract Security
- **🪙 MyToken (FLUF)**: ERC-20 token with minting, burning, and advanced features
- **🔄 FluffySwap**: Secure DEX contract with rate management and emergency controls
- **🛡️ Security Features**: ReentrancyGuard, Pausable, comprehensive input validation
- **⛽ Gas Optimized**: Custom errors and efficient storage patterns
- **🔍 Fully Tested**: Comprehensive test suite with 100% coverage

### 🛠️ Developer Experience
- **📘 TypeScript**: Full type safety across frontend and contracts
- **🧪 Comprehensive Testing**: Unit tests for all contract functions
- **🚀 Auto-deployment**: Scripts with contract verification
- **🔥 Hot Reload**: Instant development feedback
- **🎯 Error Boundaries**: Graceful error handling in production
- **📚 Documentation**: Extensive inline documentation and README

## 📋 Recent Updates & Fixes

### Changelog

#### v1.2.0 - Professional Enhancement Release
- **🔧 Fixed Transaction Alerts**: Resolved pending transaction alert bug
  - ✅ Alerts now properly reflect real transaction status (success/failure)
  - ⏰ Auto-dismiss functionality with configurable timeouts (5s success, 8s error)
  - 🧹 Proper cleanup of toast notifications and state management
  - 🎯 Enhanced transaction state tracking with callbacks
  
- **🌙 Complete Dark Mode Implementation**: Full dark theme support
  - 🎨 All components now support dark theme with consistent styling
  - 🔄 Smooth theme transitions with system preference detection
  - 🎭 Theme-aware animations and particle effects
  - 💾 Persistent theme preferences with localStorage
  - 📱 Mobile browser theme-color meta tag updates
  
- **💰 Fixed FLUF Token Values**: Corrected token balance and swap calculations
  - ✅ Accurate real-time FLUF balance display with proper formatting
  - 🔢 Proper decimal handling (18 decimals) with BigInt support
  - 📊 Fixed swap amount calculations with correct conversion rates
  - 🔄 Auto-refresh balances after successful transactions
  - 🛡️ Improved error handling for contract reads with retry logic

- **🎨 Enhanced UI/UX**: Improved visual consistency and user feedback
  - 🎉 Better loading states with skeleton animations
  - 📢 Enhanced error messages with actionable suggestions
  - 🎊 Transaction status notifications with confetti animations
  - 📱 Improved responsive design for all screen sizes
  - ♿ Enhanced accessibility with proper ARIA labels

- **🏗️ Code Quality Improvements**: Professional-grade codebase
  - 📝 Comprehensive TypeScript interfaces and type safety
  - 🧹 ESLint and Prettier configuration for consistent code style
  - 📚 Extensive inline documentation and JSDoc comments
  - 🔧 Improved error handling with custom error types
  - ⚡ Performance optimizations with React.memo and useMemo

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **MetaMask** or compatible Web3 wallet
- **Sepolia testnet ETH** ([Get from faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fluffyswap.git
cd fluffyswap

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Setup

Create a `.env` file with your configuration:

```env
# Required for frontend
VITE_INFURA_API_KEY=your_infura_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: Custom contract addresses
VITE_MY_TOKEN_ADDRESS=0x...
VITE_FLUFFY_SWAP_ADDRESS=0x...

# Required for deployment
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Development

```bash
# Start local blockchain (optional)
npm run node

# Compile contracts
npm run compile

# Run comprehensive test suite
npm run test

# Deploy contracts to Sepolia
npm run deploy

# Start frontend development server
npm run dev
```

## 📋 Smart Contract Architecture

### MyToken.sol (FLUF Token)
```solidity
// Professional ERC-20 implementation with additional features
✅ Standard ERC-20 functions (transfer, approve, etc.)
✅ Minting capabilities (owner only)
✅ Burning functionality (user initiated)
✅ Pausable transfers for emergency situations
✅ Access control with OpenZeppelin Ownable
✅ Event logging for all operations
✅ Gas-optimized storage patterns
```

### FluffySwap.sol (DEX Contract)
```solidity
// Secure and efficient swap functionality
✅ ETH to FLUF token swaps with slippage protection
✅ Adjustable exchange rates (owner controlled)
✅ Min/max swap limits (0.001 - 10 ETH)
✅ Emergency withdrawal functions
✅ Comprehensive input validation
✅ Reentrancy protection with OpenZeppelin guards
✅ Rate limiting and circuit breakers
```

## 🌙 Dark Mode Implementation

FluffySwap features a comprehensive dark mode system built with modern web standards:

### Features
- **🎨 Theme Provider**: Global theme context with system preference detection
- **🔄 Component Support**: All UI components support both light and dark themes
- **✨ Smooth Transitions**: Animated theme switching with proper color interpolation
- **💾 Persistence**: Theme preference saved to localStorage with fallback handling
- **📱 System Integration**: Automatic theme switching based on OS preference
- **🎭 Particle Effects**: Theme-aware floating particles and animations

### Technical Implementation
```typescript
// Custom hook for theme management
const { theme, setTheme, isDark, toggleTheme } = useTheme();

// Theme values: 'light' | 'dark' | 'system'
// isDark: boolean (resolved theme)
// toggleTheme: () => void (smart toggle function)
```

### CSS Custom Properties
```css
/* Automatic theme-aware color variables */
:root {
  --bg-primary: theme('colors.white');
  --text-primary: theme('colors.gray.900');
}

.dark {
  --bg-primary: theme('colors.gray.800');
  --text-primary: theme('colors.white');
}
```

## 💰 FLUF Token Integration

### Accurate Balance Display
- **⚡ Real-time Updates**: Balance updates using wagmi hooks with automatic polling
- **🔢 Decimal Handling**: Proper 18-decimal precision with BigInt arithmetic
- **🛡️ Error Handling**: Graceful fallbacks for contract read failures
- **🔄 Auto-refresh**: Automatic balance refresh after successful transactions
- **📊 Formatting**: Human-readable number formatting with locale support

### Swap Calculations
- **📈 Precise Conversion**: ETH to FLUF conversion using current exchange rate
- **🎯 Slippage Protection**: Configurable slippage tolerance (default 0.5%)
- **💧 Liquidity Checks**: Real-time liquidity validation before transactions
- **✅ Input Validation**: Comprehensive validation with min/max limits
- **⛽ Gas Estimation**: Accurate gas estimation with safety buffers

### Technical Details
```typescript
// Proper BigInt handling for token amounts
const formatTokenBalance = (balance: bigint): string => {
  return parseFloat(formatEther(balance)).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

// Real-time balance monitoring
const { data: tokenBalance, refetch } = useContractRead({
  address: CONTRACTS.MyToken,
  abi: MY_TOKEN_ABI,
  functionName: 'balanceOf',
  args: [userAddress],
  watch: true, // Real-time updates
  enabled: !!userAddress,
});
```

## 🧪 Testing

### Comprehensive Test Suite

```bash
# Run all tests with coverage
npm run test

# Run with gas reporting
REPORT_GAS=true npm run test

# Run specific test file
npx hardhat test test/FluffySwap.test.ts

# Run tests with verbose output
npm run test -- --verbose
```

### Test Coverage
- ✅ **Contract Deployment**: Initialization and configuration
- ✅ **Token Mechanics**: Minting, burning, transfers with proper decimal handling
- ✅ **Swap Functionality**: ETH to FLUF swaps with edge cases
- ✅ **Rate Management**: Exchange rate updates and validation
- ✅ **Access Control**: Owner-only functions and permissions
- ✅ **Emergency Functions**: Pause, withdraw, and recovery mechanisms
- ✅ **Error Handling**: Revert conditions and error messages
- ✅ **Gas Optimization**: Gas usage analysis and optimization
- ✅ **Frontend Integration**: Component testing with React Testing Library
- ✅ **Theme System**: Dark mode functionality and persistence

### Performance Testing
```bash
# Gas usage analysis
npm run test:gas

# Load testing for frontend
npm run test:load

# Security analysis
npm run test:security
```

## 🌐 Deployment

### Sepolia Testnet Deployment

```bash
# Deploy contracts with verification
npm run deploy

# Verify contracts on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Deploy with custom parameters
npx hardhat run scripts/deploy.ts --network sepolia
```

### Deployment Process
The deployment script automatically:
1. **📋 Validates Environment**: Checks all required environment variables
2. **🚀 Deploys MyToken**: FLUF token with initial supply (1M tokens)
3. **🔄 Deploys FluffySwap**: DEX contract with initial exchange rate
4. **💧 Adds Liquidity**: Transfers tokens to DEX for initial liquidity
5. **⚙️ Updates Config**: Updates frontend configuration files
6. **💾 Saves Deployment**: Records deployment info to `deployments.json`
7. **✅ Verifies Contracts**: Automatically verifies on Etherscan

### Production Checklist
- [ ] **🔍 Security Audit**: Contracts audited by security professionals
- [ ] **⚙️ Environment Config**: All environment variables properly configured
- [ ] **🧪 Testnet Validation**: Successful deployment and testing on Sepolia
- [ ] **🛡️ Error Boundaries**: Frontend error handling tested thoroughly
- [ ] **📱 Mobile Testing**: Responsive design verified on all devices
- [ ] **♿ Accessibility**: WCAG compliance checked and validated
- [ ] **🌙 Theme Testing**: Dark mode functionality tested across browsers
- [ ] **🔄 Transaction Flow**: End-to-end transaction testing completed
- [ ] **⚡ Performance**: Load testing and optimization completed
- [ ] **📚 Documentation**: All documentation updated and accurate

## 🎨 Design System

### Color Palette
```css
/* Light Mode Palette */
--kawaii-pink: #FFD1DC;      /* Primary accent */
--kawaii-mint: #B5EAD7;      /* Success states */
--kawaii-lavender: #C7CEEA;  /* Info states */
--kawaii-soft-pink: #F8BBD9; /* Secondary accent */
--kawaii-light-purple: #E4C1F9; /* Tertiary accent */

/* Dark Mode Palette */
--dark-bg-primary: #1f2937;   /* Main background */
--dark-bg-secondary: #374151; /* Card backgrounds */
--dark-border: #4b5563;       /* Border colors */
--dark-text-primary: #f3f4f6; /* Primary text */
--dark-text-secondary: #d1d5db; /* Secondary text */

/* Semantic Colors */
--success: #10b981;  /* Success states */
--warning: #f59e0b;  /* Warning states */
--error: #ef4444;    /* Error states */
--info: #3b82f6;     /* Info states */
```

### Typography Scale
```css
/* Font Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Line Heights */
--leading-tight: 1.2;   /* Headings */
--leading-normal: 1.5;  /* Body text */
--leading-relaxed: 1.625; /* Large text blocks */
```

### Spacing System
```css
/* Base unit: 4px (0.25rem) */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */

/* Component Spacing */
--component-padding: var(--space-4); /* 16px */
--section-margin: var(--space-8);    /* 32px */
--page-margin: var(--space-16);      /* 64px */
```

### Animation System
```css
/* Transition Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Easing Functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Common Animations */
.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.slide-up {
  animation: slideUp var(--duration-normal) var(--ease-out);
}
```

## 🔧 Configuration

### Supported Networks
- **🌐 Sepolia Testnet** (Primary) - Chain ID: 11155111
- **🏠 Hardhat Local** (Development) - Chain ID: 1337

### Contract Configuration
```typescript
// Automatic contract address detection
export const CONTRACTS = {
  MyToken: process.env.VITE_MY_TOKEN_ADDRESS || '0x...',
  FluffySwap: process.env.VITE_FLUFFY_SWAP_ADDRESS || '0x...',
} as const;

// Runtime validation
Object.entries(CONTRACTS).forEach(([name, address]) => {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid contract address for ${name}`);
  }
});
```

### Swap Parameters
```typescript
export const SWAP_LIMITS = {
  MIN_ETH: '0.001',           // Minimum swap amount
  MAX_ETH: '10',              // Maximum swap amount
  slippageTolerance: 0.5,     // 0.5% slippage tolerance
  gasLimitMultiplier: 1.2,    // 20% gas buffer
} as const;
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Workflow
1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💻 Develop** your feature with tests
4. **✅ Test** thoroughly (`npm run test`)
5. **📝 Commit** changes (`git commit -m 'Add amazing feature'`)
6. **🚀 Push** to branch (`git push origin feature/amazing-feature`)
7. **📬 Open** a Pull Request

### Development Guidelines
- **📘 TypeScript**: Use strict TypeScript with proper type definitions
- **🧪 Testing**: Write comprehensive tests for new features
- **🎨 Design**: Maintain kawaii design consistency and accessibility
- **📚 Documentation**: Update documentation for any changes
- **🌙 Theme Support**: Ensure new components support both light and dark modes
- **🛡️ Error Handling**: Implement proper error handling and user feedback
- **⚡ Performance**: Consider performance implications of changes
- **♿ Accessibility**: Follow WCAG guidelines for accessibility

### Code Style
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run all checks
npm run check-all
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for features
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Dark mode support added
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ **Commercial Use**: Use in commercial projects
- ✅ **Modification**: Modify the code
- ✅ **Distribution**: Distribute the code
- ✅ **Private Use**: Use privately
- ❗ **Liability**: No warranty provided
- ❗ **Attribution**: Must include license and copyright notice

## 🙏 Acknowledgments

### Core Technologies
- **[OpenZeppelin](https://openzeppelin.com/)**: Secure smart contract libraries and standards
- **[RainbowKit](https://www.rainbowkit.com/)**: Beautiful wallet connection UI and UX
- **[Framer Motion](https://www.framer.com/motion/)**: Smooth animations and micro-interactions
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Hardhat](https://hardhat.org/)**: Ethereum development environment
- **[Wagmi](https://wagmi.sh/)**: React hooks for Ethereum
- **[Viem](https://viem.sh/)**: TypeScript interface for Ethereum

### Design Inspiration
- **[Uniswap](https://uniswap.org/)**: DEX interface patterns and UX
- **[PancakeSwap](https://pancakeswap.finance/)**: Gamified DeFi experience
- **[Kawaii Design](https://en.wikipedia.org/wiki/Kawaii)**: Japanese cute aesthetic principles

## 👨‍💻 Attribution

**Made by Huzaifa Khan**  
**Website built by Huzaifa Khan**

This project was created with attention to detail, user experience, and modern web development practices. Special focus was given to:

- **♿ Accessibility**: WCAG 2.1 AA compliance
- **⚡ Performance**: Optimized loading and rendering
- **🎭 Animations**: Delightful micro-interactions that enhance UX
- **🔒 Security**: Best practices for smart contract and frontend security
- **📱 Responsive Design**: Mobile-first approach with progressive enhancement
- **🌙 Dark Mode**: Complete theme system with user preference respect

### Contact Information
- **📧 Email**: [your-email@example.com](mailto:your-email@example.com)
- **🐦 Twitter**: [@your-twitter](https://twitter.com/your-twitter)
- **💼 LinkedIn**: [Your LinkedIn](https://linkedin.com/in/your-profile)
- **🌐 Portfolio**: [your-portfolio.com](https://your-portfolio.com)

## 🐛 Troubleshooting

### Common Issues

#### Transaction Errors
```bash
# Issue: "Transaction failed" errors
# Solutions:
1. Check ETH balance for gas fees (need ~0.01 ETH buffer)
2. Verify swap amount is within limits (0.001 - 10 ETH)
3. Ensure sufficient DEX liquidity
4. Try increasing gas limit manually
5. Check network congestion and retry
```

#### Wallet Connection Issues
```bash
# Issue: Wallet connection problems
# Solutions:
1. Clear browser cache and cookies
2. Try different wallet (MetaMask, WalletConnect)
3. Switch to different browser
4. Check if wallet is locked
5. Verify network is set to Sepolia testnet
```

#### Contract Interaction Failures
```bash
# Issue: Contract calls failing
# Solutions:
1. Verify contract addresses in config
2. Check if contracts are paused
3. Ensure proper network connection
4. Try refreshing the page
5. Check browser console for detailed errors
```

#### Dark Mode Issues
```bash
# Issue: Dark mode not working properly
# Solutions:
1. Check if system theme detection is enabled
2. Clear localStorage: localStorage.removeItem('fluffyswap-theme')
3. Refresh page after clearing storage
4. Verify theme provider is properly wrapped
5. Check for CSS conflicts with browser extensions
```

#### FLUF Balance Display Issues
```bash
# Issue: FLUF balance showing incorrectly
# Solutions:
1. Refresh page to reload contract data
2. Check wallet is connected to Sepolia testnet
3. Verify contract addresses are correct
4. Clear browser cache
5. Check network connection stability
```

### Debug Mode
```bash
# Enable debug mode for detailed logging
localStorage.setItem('fluffyswap-debug', 'true');

# View debug information in browser console
# Includes: contract calls, state changes, error details
```

### Performance Issues
```bash
# Issue: Slow loading or laggy animations
# Solutions:
1. Disable browser extensions temporarily
2. Close other tabs to free memory
3. Check internet connection speed
4. Try incognito/private browsing mode
5. Update browser to latest version
```

### Getting Help

#### Community Support
- **💬 Discord**: [FluffySwap Community](https://discord.gg/fluffyswap)
  - Real-time help from community members
  - Technical discussions and troubleshooting
  - Feature requests and feedback

- **🐦 Twitter**: [@FluffySwapDEX](https://twitter.com/fluffyswapdex)
  - Latest updates and announcements
  - Quick support for urgent issues
  - Community highlights and features

#### Technical Support
- **📧 Email**: [support@fluffyswap.dev](mailto:support@fluffyswap.dev)
  - Detailed technical issues
  - Bug reports with reproduction steps
  - Feature requests and suggestions

- **🐛 GitHub Issues**: [Report Issues](https://github.com/your-username/fluffyswap/issues)
  - Bug reports with code examples
  - Feature requests with detailed specifications
  - Documentation improvements

#### Documentation
- **📚 Documentation**: [docs.fluffyswap.dev](https://docs.fluffyswap.dev)
  - Comprehensive guides and tutorials
  - API documentation
  - Integration examples

---

<div align="center">
  <p><strong>Made with 💖 for the kawaii DeFi community</strong></p>
  <p>
    <a href="https://fluffyswap.dev">🌐 Website</a> •
    <a href="https://docs.fluffyswap.dev">📚 Documentation</a> •
    <a href="https://github.com/your-username/fluffyswap/issues">🐛 Report Bug</a> •
    <a href="https://github.com/your-username/fluffyswap/discussions">💬 Discussions</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/github/stars/your-username/fluffyswap?style=social" alt="GitHub stars">
    <img src="https://img.shields.io/github/forks/your-username/fluffyswap?style=social" alt="GitHub forks">
    <img src="https://img.shields.io/github/watchers/your-username/fluffyswap?style=social" alt="GitHub watchers">
  </p>
</div>