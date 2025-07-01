import React from 'react';
import { motion } from 'framer-motion';
import { useContractRead } from 'wagmi';
import { TrendingUp, DollarSign, Zap, BarChart3 } from 'lucide-react';
import { CONTRACTS, FLUFFY_SWAP_ABI } from '../config/contracts';

export const StatsModule: React.FC = () => {
  // Get current token rate
  const { data: tokenRate, isError: isTokenRateError } = useContractRead({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'tokensPerEth',
    enabled: true,
    watch: true,
  });

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/30 overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-yellow-500 rounded-full flex items-center justify-center">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
            Market Stats
          </h3>
          <p className="text-sm text-gray-500">Live exchange data</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-4">
        {/* Exchange Rate */}
        <motion.div
          className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-100/50"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp size={20} className="text-blue-500" />
            </motion.div>
            <span className="text-sm font-semibold text-gray-600">Exchange Rate</span>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {isTokenRateError ? 'Error' : Number(tokenRate || 0).toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-500">FLUF per ETH</span>
          </div>
        </motion.div>

        {/* Network */}
        <motion.div
          className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm p-4 rounded-2xl border border-purple-100/50"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap size={20} className="text-purple-500" />
            </motion.div>
            <span className="text-sm font-semibold text-gray-600">Network</span>
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sepolia
          </p>
          <p className="text-xs text-gray-500 mt-1">Ethereum Testnet</p>
        </motion.div>

        {/* Fee Structure */}
        <motion.div
          className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm p-4 rounded-2xl border border-green-100/50"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <DollarSign size={20} className="text-green-500" />
            </motion.div>
            <span className="text-sm font-semibold text-gray-600">Swap Fee</span>
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            0%
          </p>
          <p className="text-xs text-gray-500 mt-1">No platform fees</p>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100/50"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Min Swap:</span>
              <span className="font-medium text-gray-800">0.001 ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Max Swap:</span>
              <span className="font-medium text-gray-800">10 ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Slippage:</span>
              <span className="font-medium text-gray-800">0%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-green-400 rounded-full"
        />
        <span>Live Data</span>
      </motion.div>
    </motion.div>
  );
};