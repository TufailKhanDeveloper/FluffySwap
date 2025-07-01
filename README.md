# 🌸 FluffySwap - Kawaii Decentralized Exchange

A production-ready, kawaii-themed decentralized exchange (DEX) built for Ethereum Sepolia testnet. Swap ETH for FLUF tokens with adorable animations, secure smart contracts, and delightful user experience.

![FluffySwap Preview](https://via.placeholder.com/800x400/FFD1DC/333333?text=FluffySwap+🌸)

## ✨ Features

### 🎨 Frontend
- **Kawaii Design**: Pastel color palette with floating particle animations
- **Full Dark Mode**: Complete dark theme support across all components
- **Responsive UI**: Mobile-first design with smooth micro-interactions
- **Wallet Integration**: MetaMask + WalletConnect via RainbowKit
- **Real-time Updates**: Live balance and transaction status with proper state management
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Accessibility**: WCAG compliant with keyboard navigation

### 🔐 Smart Contracts
- **MyToken (FLUF)**: ERC-20 token with minting, burning, and pause functionality
- **FluffySwap**: Secure DEX contract with rate management and emergency controls
- **Security Features**: ReentrancyGuard, Pausable, input validation
- **Gas Optimized**: Custom errors and efficient storage patterns

### 🛠️ Developer Experience
- **TypeScript**: Full type safety across frontend and contracts
- **Comprehensive Testing**: Unit tests for all contract functions
- **Auto-deployment**: Scripts with contract verification
- **Hot Reload**: Instant development feedback
- **Error Boundaries**: Graceful error handling in production

## 📋 Recent Updates & Fixes

### Changelog

#### v1.2.0 - Latest Fixes
- **🔧 Fixed Transaction Alerts**: Resolved pending transaction alert bug that remained on screen indefinitely
  - Alerts now properly reflect real transaction status (success/failure)
  - Auto-dismiss functionality with configurable timeouts
  - Proper cleanup of toast notifications
  
- **🌙 Complete Dark Mode**: Implemented full dark mode support
  - All components now support dark theme
  - Consistent theming across headers, sidebars, modals, and forms
  - Smooth theme transitions with system preference detection
  
- **💰 Fixed FLUF Token Values**: Corrected token balance and swap calculations
  - Accurate real-time FLUF balance display
  - Proper decimal handling (18 decimals)
  - Fixed swap amount calculations with correct conversion rates
  - Improved error handling for contract reads

- **🎨 Enhanced UI/UX**: Improved visual consistency and user feedback
  - Better loading states and error messages
  - Enhanced transaction status notifications with confetti animations
  - Improved responsive design for mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

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

Edit `.env` with your configuration:

```env
# Required for frontend
VITE_INFURA_API_KEY=your_infura_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

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

# Run tests
npm run test

# Deploy contracts to Sepolia
npm run deploy

# Start frontend development server
npm run dev
```

## 📋 Smart Contract Architecture

### MyToken.sol (FLUF Token)
```solidity
// ERC-20 token with additional features
- Minting (owner only)
- Burning (user initiated)
- Pausable transfers
- Max supply cap (1M tokens)
- Event logging for all operations
```

### FluffySwap.sol (DEX Contract)
```solidity
// Secure swap functionality
- ETH to FLUF token swaps
- Adjustable exchange rates
- Min/max swap limits (0.001 - 10 ETH)
- Emergency withdrawal functions
- Comprehensive input validation
- Reentrancy protection
```

## 🌙 Dark Mode Implementation

FluffySwap features a comprehensive dark mode system:

- **Theme Provider**: Global theme context with system preference detection
- **Component Support**: All UI components support both light and dark themes
- **Smooth Transitions**: Animated theme switching with proper color interpolation
- **Persistence**: Theme preference saved to localStorage
- **System Integration**: Automatic theme switching based on OS preference

### Usage
```typescript
import { useTheme } from './hooks/useTheme';

const { theme, setTheme, isDark } = useTheme();
// theme: 'light' | 'dark' | 'system'
// isDark: boolean (resolved theme)
```

## 💰 FLUF Token Integration

### Accurate Balance Display
- Real-time balance updates using wagmi hooks
- Proper decimal handling (18 decimals)
- Error handling for contract read failures
- Automatic balance refresh after transactions

### Swap Calculations
- Precise ETH to FLUF conversion using current exchange rate
- Slippage tolerance and liquidity checks
- Input validation with min/max limits
- Gas estimation and transaction simulation

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm run test

# Run with gas reporting
REPORT_GAS=true npm run test

# Run specific test file
npx hardhat test test/FluffySwap.test.ts
```

### Test Coverage
- ✅ Contract deployment and initialization
- ✅ Token swapping mechanics with proper decimal handling
- ✅ Rate management and validation
- ✅ Withdrawal functions (ETH + tokens)
- ✅ Pause/unpause functionality
- ✅ Error handling and edge cases
- ✅ Access control and permissions
- ✅ Transaction state management
- ✅ Dark mode theme switching

## 🌐 Deployment

### Sepolia Testnet Deployment

```bash
# Deploy contracts
npm run deploy

# Verify contracts on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

The deployment script will:
1. Deploy MyToken (FLUF) with initial supply
2. Deploy FluffySwap with initial rate
3. Transfer tokens to DEX for liquidity
4. Update frontend configuration
5. Save deployment info to `deployments.json`

### Production Checklist
- [ ] Contracts audited and tested
- [ ] Environment variables configured
- [ ] Testnet deployment successful
- [ ] Frontend error boundaries tested
- [ ] Mobile responsiveness verified
- [ ] Accessibility compliance checked
- [ ] Dark mode functionality tested
- [ ] Transaction flow end-to-end tested

## 🎨 Design System

### Color Palette
```css
/* Light mode */
--pink-pastel: #FFD1DC
--mint-green: #B5EAD7  
--lavender: #C7CEEA
--soft-pink: #F8BBD9
--light-purple: #E4C1F9

/* Dark mode */
--dark-bg: #1f2937
--dark-surface: #374151
--dark-border: #4b5563
--dark-text: #f3f4f6
```

### Typography
- **Headings**: 120% line height, semibold weight
- **Body**: 150% line height, regular weight
- **Max 3 font weights**: Regular, semibold, bold

### Spacing System
- **Base unit**: 8px
- **Component padding**: 16px, 24px, 32px
- **Section margins**: 32px, 48px, 64px

## 🔧 Configuration

### Supported Networks
- **Sepolia Testnet** (Primary)
- **Hardhat Local** (Development)

### Contract Addresses
After deployment, addresses are automatically updated in:
- `src/config/contracts.ts`
- `deployments.json`

### Swap Limits
- **Minimum**: 0.001 ETH
- **Maximum**: 10 ETH per transaction
- **Rate**: Configurable by contract owner

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Maintain kawaii design consistency
- Update documentation for changes
- Test both light and dark modes
- Ensure proper error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin**: Secure smart contract libraries
- **RainbowKit**: Beautiful wallet connection UI
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Utility-first styling
- **Hardhat**: Ethereum development environment

## 👨‍💻 Attribution

**Made by Huzaifa Khan**  
Website built by Huzaifa Khan

This project was created with attention to detail, user experience, and modern web development practices. Special focus was given to accessibility, performance, and delightful animations that make DeFi interactions more enjoyable.

## 🐛 Troubleshooting

### Common Issues

**"Transaction failed" errors**
- Check ETH balance for gas fees
- Verify swap amount is within limits
- Ensure sufficient DEX liquidity

**Wallet connection issues**
- Clear browser cache and cookies
- Try different wallet or browser
- Check network is set to Sepolia

**Contract interaction failures**
- Verify contract addresses in config
- Check if contracts are paused
- Ensure proper network connection

**Dark mode not working**
- Check if system theme detection is enabled
- Clear localStorage and refresh
- Verify theme provider is properly wrapped

**FLUF balance showing incorrectly**
- Refresh the page to reload contract data
- Check if wallet is connected to Sepolia
- Verify contract addresses are correct

### Support

- 📧 Email: support@fluffyswap.dev
- 💬 Discord: [FluffySwap Community](https://discord.gg/fluffyswap)
- 🐦 Twitter: [@FluffySwapDEX](https://twitter.com/fluffyswapdex)

---

<div align="center">
  <p>Made with 💖 for the kawaii DeFi community</p>
  <p>
    <a href="https://fluffyswap.dev">Website</a> •
    <a href="https://docs.fluffyswap.dev">Documentation</a> •
    <a href="https://github.com/your-username/fluffyswap/issues">Report Bug</a>
  </p>
</div>