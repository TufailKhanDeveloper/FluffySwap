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
     
        <div className="text-center py-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wallet size={48} className="text-slate-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Connect Wallet
          </h3>
          <p className="text-sm text-slate-400">
            Connect your wallet to view balances and start swapping
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bg-slate-900 rounded-3xl shadow-xl p-6 border border-slate-700 ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <Wallet size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            Your Wallet
          </h3>
          <p className="text-sm text-slate-400">Token balances</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="space-y-4">
        {/* ETH Balance - Now using purple/pink colors */}
        <motion.div
          className="bg-gradient-to-r from-purple-600/20 to-pink-500/20 p-4 rounded-2xl border border-purple-500/30"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <TokenIcon symbol="ETH" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Ethereum</p>
                <p className="text-xs text-slate-400">ETH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">
                {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0.0000'}
              </p>
              <p className="text-xs text-slate-400">Available</p>
            </div>
          </div>
        </motion.div>

        {/* FLUF Balance - Now using blue colors */}
        <motion.div
          className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 p-4 rounded-2xl border border-blue-500/30"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <TokenIcon symbol="FLUF" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">FluffyToken</p>
                <p className="text-xs text-slate-400">FLUF</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">
                {isFlufBalanceError ? (
                  <span className="text-red-400 text-sm">Error</span>
                ) : flufBalance ? (
                  parseFloat(formatEther(flufBalance)).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })
                ) : (
                  '0'
                )}
              </p>
              <p className="text-xs text-slate-400">In Wallet</p>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {isFlufBalanceError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <p className="text-xs text-red-400">
              Unable to load FLUF balance: {flufBalanceError?.message}
            </p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="pt-4 border-t border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
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
              className="flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
            >
              <ExternalLink size={12} />
              Get Testnet ETH
            </motion.a>
          </div>
        </motion.div>

        {/* Wallet Address */}
        <motion.div
          className="pt-4 border-t border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Connected Address</p>
            <p className="text-xs font-mono text-slate-300 bg-slate-700 px-2 py-1 rounded">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};