import React from 'react';
import { motion } from 'framer-motion';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import { Wallet, TrendingUp, ExternalLink } from 'lucide-react';
import { TokenIcon } from './TokenIcon';
import { CONTRACTS, MY_TOKEN_ABI, FAUCET_LINKS } from '../config/contracts';

interface WalletInfoProps {
  className?: string;
}

export const WalletInfo: React.FC<WalletInfoProps> = ({ className = '' }) => {
  const { address, isConnected } = useAccount();

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address,
    watch: true,
  });

  // Get FLUF token balance with proper error handling
  const { 
    data: flufBalance, 
    isError: isFlufBalanceError,
    error: flufBalanceError 
  } = useContractRead({
    address: CONTRACTS.MyToken,
    abi: MY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
    watch: true,
    onError: (error) => {
      console.error('FLUF balance read error:', error);
    },
  });

  if (!isConnected) {
    return (
      <motion.div
        className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center py-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wallet size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Connect Wallet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Connect your wallet to view balances and start swapping
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
          <Wallet size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Your Wallet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Token balances</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="space-y-4">
        {/* ETH Balance */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <TokenIcon symbol="ETH" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-200">Ethereum</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">ETH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0.0000'}
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-500">Available</p>
            </div>
          </div>
        </motion.div>

        {/* FLUF Balance */}
        <motion.div
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <TokenIcon symbol="FLUF" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-purple-800 dark:text-purple-200">FluffyToken</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">FLUF</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {isFlufBalanceError ? (
                  <span className="text-red-500 text-sm">Error</span>
                ) : flufBalance ? (
                  parseFloat(formatEther(flufBalance)).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })
                ) : (
                  '0'
                )}
              </p>
              <p className="text-xs text-purple-500 dark:text-purple-500">In Wallet</p>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {isFlufBalanceError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <p className="text-xs text-red-600 dark:text-red-400">
              Unable to load FLUF balance: {flufBalanceError?.message}
            </p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="pt-4 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <TrendingUp size={12} />
            <span>Quick Actions</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <motion.a
              href={FAUCET_LINKS.sepolia}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <ExternalLink size={12} />
              Get Testnet ETH
            </motion.a>
          </div>
        </motion.div>

        {/* Wallet Address */}
        <motion.div
          className="pt-4 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Connected Address</p>
            <p className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};