import React from 'react';
import { motion } from 'framer-motion';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import { Wallet, Info, TrendingUp } from 'lucide-react';
import { CONTRACTS, MY_TOKEN_ABI } from '../config/contracts';

// ETH Icon Component
const EthIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L5.5 12.5L12 16L18.5 12.5L12 2Z"
      fill="currentColor"
      fillOpacity="0.6"
    />
    <path
      d="M12 17.5L5.5 13.5L12 22L18.5 13.5L12 17.5Z"
      fill="currentColor"
    />
  </svg>
);

// FLUF Token Icon Component
const FlufIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
    <circle cx="8" cy="10" r="3" fill="currentColor" fillOpacity="0.4" />
    <circle cx="16" cy="10" r="3" fill="currentColor" fillOpacity="0.4" />
    <circle cx="12" cy="14" r="4" fill="currentColor" fillOpacity="0.6" />
    <circle cx="6" cy="14" r="2" fill="currentColor" fillOpacity="0.3" />
    <circle cx="18" cy="14" r="2" fill="currentColor" fillOpacity="0.3" />
    <circle cx="12" cy="8" r="2.5" fill="currentColor" fillOpacity="0.5" />
    <circle cx="15" cy="7" r="0.5" fill="currentColor" />
    <circle cx="9" cy="6" r="0.5" fill="currentColor" />
    <circle cx="17" cy="17" r="0.5" fill="currentColor" />
    <circle cx="7" cy="18" r="0.5" fill="currentColor" />
  </svg>
);

export const BalanceModule: React.FC = () => {
  const { address, isConnected } = useAccount();

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address,
    watch: true,
  });

  // Get FLUF token balance
  const { data: tokenBalance, isError: isTokenBalanceError } = useContractRead({
    address: CONTRACTS.MyToken,
    abi: MY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  const formatTokenValue = (value: unknown): string => {
    try {
      if (!value) return '0';
      
      if (typeof value === 'bigint') {
        return parseFloat(formatEther(value)).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
      }
      
      return '0';
    } catch (error) {
      console.error('Format error:', error);
      return '0';
    }
  };

  if (!isConnected) {
    return (
      <motion.div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/30"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="text-center py-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wallet size={48} className="text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Connect Wallet</h3>
          <p className="text-sm text-gray-500">
            Connect your wallet to view your balances
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/30 overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
          <Wallet size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Your Balances
          </h3>
          <p className="text-sm text-gray-500">Wallet holdings</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="space-y-4">
        {/* ETH Balance */}
        <motion.div
          className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-100/50"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <EthIcon size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-800">Ethereum</p>
                <p className="text-xs text-blue-600">ETH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0.0000'}
              </p>
              <p className="text-xs text-blue-500">Available</p>
            </div>
          </div>
        </motion.div>

        {/* FLUF Balance */}
        <motion.div
          className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm p-4 rounded-2xl border border-purple-100/50"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <FlufIcon size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-purple-800">FluffyToken</p>
                <p className="text-xs text-purple-600">FLUF</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isTokenBalanceError ? 'Error' : formatTokenValue(tokenBalance)}
              </p>
              <p className="text-xs text-purple-500">In Wallet</p>
            </div>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100/50"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info size={12} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Balance Info</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                These are your wallet balances. FLUF tokens in the liquidity pool are separate from your wallet balance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="pt-4 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <TrendingUp size={12} />
            <span>Quick Actions</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 bg-blue-100/50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200/50 transition-colors"
            >
              Get ETH
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 bg-purple-100/50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200/50 transition-colors"
            >
              Add Liquidity
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};