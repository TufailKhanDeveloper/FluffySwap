import React from 'react';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { wagmiConfig, chains } from './config/wagmi';
import { Header } from './components/Header';
import { SwapInterface } from './components/SwapInterface';
import { PoolInfo } from './components/PoolInfo';
import { WalletInfo } from './components/WalletInfo';
import { FloatingParticles } from './components/FloatingParticles';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const AppContent: React.FC = () => {
  const customLightTheme = lightTheme({
    accentColor: '#ec4899',
    accentColorForeground: 'white',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
  });

  // Light theme gradient configurations
  const lightGradients = [
    'linear-gradient(135deg, #fce7f3, #f3e8ff, #e0f2fe)',
    'linear-gradient(225deg, #fdf2f8, #ede9fe, #cffafe)',
    'linear-gradient(315deg, #fce7f3, #ddd6fe, #e0f7fa)',
    'linear-gradient(45deg, #fef7ff, #f0f9ff, #ecfdf5)',
    'linear-gradient(135deg, #fce7f3, #f3e8ff, #e0f2fe)',
  ];

  return (
    <RainbowKitProvider 
      chains={chains} 
      theme={customLightTheme}
    >
      {/* Main App Container with Light Theme Only */}
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50">
        {/* Static Light Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50" />

        {/* Enhanced Multi-Layer Background - Light Theme Only */}
        <div className="absolute inset-0">
          {/* Animated Base Gradient */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: lightGradients
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Animated Orbs - Light Theme Colors */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 100%)'
            }}
            animate={{
              x: [0, 120, -80, 0],
              y: [0, -60, 120, 0],
              scale: [1, 1.3, 0.7, 1],
              opacity: [0.8, 1, 0.6, 0.8],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.div
            className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)'
            }}
            animate={{
              x: [0, -100, 140, 0],
              y: [0, 100, -80, 0],
              scale: [0.8, 1.4, 0.9, 0.8],
              opacity: [0.7, 0.9, 0.5, 0.7],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />

          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, rgba(34, 211, 238, 0.06) 50%, transparent 100%)'
            }}
            animate={{
              x: [0, 80, -60, 0],
              y: [0, -40, 80, 0],
              scale: [1, 1.2, 0.9, 1],
              opacity: [0.6, 0.8, 0.4, 0.6],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />

          {/* Grid Pattern - Light Theme */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(168, 85, 247, 0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(168, 85, 247, 0.06) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />

          {/* Additional Texture Layer - Light Theme */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)',
            }}
          />
        </div>

        <FloatingParticles />
        
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
            {/* Main Swap Interface - Center */}
            <div className="lg:col-span-6 lg:col-start-4">
              <SwapInterface />
            </div>

            {/* Pool Info - Left Sidebar (Desktop) / Below Swap (Mobile) */}
            <div className="lg:col-span-3 lg:col-start-1 lg:row-start-1 order-2 lg:order-1">
              <PoolInfo />
            </div>

            {/* Wallet Info - Right Sidebar (Desktop) / Below Pool (Mobile) */}
            <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 order-3 lg:order-2">
              <WalletInfo />
            </div>
          </div>
        </main>

        {/* Enhanced Footer with Attribution - Light Theme Only */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="relative z-10 mt-16 pb-8"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div 
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 max-w-2xl mx-auto border border-white/40 shadow-2xl"
              whileHover={{
                scale: 1.02,
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)'
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-gray-600 mb-4 leading-relaxed">
                FluffySwap is a kawaii-themed decentralized exchange built for the Ethereum Sepolia testnet.
                Trade ETH for FLUF tokens with adorable animations and secure smart contracts.
              </p>
              <div className="flex justify-center gap-6 text-xs text-gray-400 mb-4">
                <motion.span 
                  whileHover={{ color: '#6366f1' }}
                  className="cursor-default"
                >
                  • Sepolia Testnet Only
                </motion.span>
                <motion.span 
                  whileHover={{ color: '#8b5cf6' }}
                  className="cursor-default"
                >
                  • Educational Purpose
                </motion.span>
                <motion.span 
                  whileHover={{ color: '#06b6d4' }}
                  className="cursor-default"
                >
                  • Open Source
                </motion.span>
              </div>
              
              {/* Attribution */}
              <motion.div
                className="pt-4 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Made by Huzaifa Khan
                </p>
                <p className="text-xs text-gray-500">
                  Website built by Huzaifa Khan
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.footer>

        {/* Toast Notifications - Light Theme Only */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '16px',
              fontWeight: '500',
              backdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#374151',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease-in-out',
            },
          }}
        />
      </div>
    </RainbowKitProvider>
  );
};

/**
 * Main App Component
 * 
 * Provides the root application structure with:
 * - Wagmi configuration for Web3 interactions
 * - React Query for data fetching and caching
 * - Light theme only (dark mode removed)
 * - Error boundaries for graceful error handling
 * - Professional code organization and documentation
 */
function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;