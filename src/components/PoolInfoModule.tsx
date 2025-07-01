import React from 'react';
import { motion } from 'framer-motion';
import { useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import { Droplets, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { CONTRACTS, FLUFFY_SWAP_ABI } from '../config/contracts';

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

export const PoolInfoModule: React.FC = () => {
  // Get contract token balance for liquidity
  const { data: contractTokenBalance, isError: isContractBalanceError } = useContractRead({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'getTokenBalance',
    enabled: true,
    watch: true,
  });

  // Get contract ETH balance
  const { data: contractEthBalance } = useContractRead({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'getEthBalance',
    enabled: true,
    watch: true,
  });

  const liquidityAmount = contractTokenBalance ? formatEther(contractTokenBalance) : '0';
  const ethAmount = contractEthBalance ? formatEther(contractEthBalance) : '0';
  const hasLiquidity = parseFloat(liquidityAmount) > 0;
  const liquidityLevel = parseFloat(liquidityAmount);

  const getLiquidityStatus = () => {
    if (liquidityLevel === 0) {
      return { status: 'empty', color: 'red', icon: AlertTriangle };
    } else if (liquidityLevel < 1000) {
      return { status: 'low', color: 'yellow', icon: AlertTriangle };
    } else if (liquidityLevel < 10000) {
      return { status: 'medium', color: 'blue', icon: TrendingUp };
    } else {
      return { status: 'high', color: 'green', icon: CheckCircle };
    }
  };

  const liquidityStatus = getLiquidityStatus();
  const StatusIcon = liquidityStatus.icon;

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/30 overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <Droplets size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Pool Info
          </h3>
          <p className="text-sm text-gray-500">Liquidity status</p>
        </div>
      </div>

      {/* Liquidity Status */}
      <motion.div
        className={`bg-gradient-to-r ${
          liquidityStatus.color === 'red' ? 'from-red-50/80 to-pink-50/80 border-red-100/50' :
          liquidityStatus.color === 'yellow' ? 'from-yellow-50/80 to-orange-50/80 border-yellow-100/50' :
          liquidityStatus.color === 'blue' ? 'from-blue-50/80 to-cyan-50/80 border-blue-100/50' :
          'from-green-50/80 to-emerald-50/80 border-green-100/50'
        } backdrop-blur-sm p-4 rounded-2xl border mb-4`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <StatusIcon size={20} className={`text-${liquidityStatus.color}-600`} />
          </motion.div>
          <div>
            <p className={`font-semibold text-${liquidityStatus.color}-800 capitalize`}>
              {liquidityStatus.status} Liquidity
            </p>
            <p className={`text-xs text-${liquidityStatus.color}-600`}>
              {liquidityStatus.status === 'empty' ? 'No tokens available' :
               liquidityStatus.status === 'low' ? 'Limited swapping capacity' :
               liquidityStatus.status === 'medium' ? 'Good for small swaps' :
               'Excellent liquidity depth'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pool Stats */}
      <div className="space-y-4">
        {/* FLUF Tokens */}
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
                <p className="font-semibold text-purple-800">FLUF Tokens</p>
                <p className="text-xs text-purple-600">Available for swap</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isContractBalanceError ? 'Error' : parseFloat(liquidityAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </p>
              <p className="text-xs text-purple-500">FLUF</p>
            </div>
          </div>
        </motion.div>

        {/* ETH Balance */}
        <motion.div
          className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-100/50"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">ETH</span>
              </div>
              <div>
                <p className="font-semibold text-blue-800">ETH Balance</p>
                <p className="text-xs text-blue-600">Contract holdings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {parseFloat(ethAmount).toFixed(4)}
              </p>
              <p className="text-xs text-blue-500">ETH</p>
            </div>
          </div>
        </motion.div>

        {/* Pool Health */}
        <motion.div
          className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100/50"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={16} className="text-gray-600" />
            <span className="font-medium text-gray-700">Pool Health</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                hasLiquidity ? 'text-green-600' : 'text-red-600'
              }`}>
                {hasLiquidity ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Swaps Available:</span>
              <span className={`font-medium ${
                hasLiquidity ? 'text-green-600' : 'text-red-600'
              }`}>
                {hasLiquidity ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Hint */}
      {!hasLiquidity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-yellow-50/80 border border-yellow-200/50 rounded-xl"
        >
          <p className="text-xs text-yellow-700 text-center">
            💡 Add liquidity to enable token swapping
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};