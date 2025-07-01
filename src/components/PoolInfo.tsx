import React from 'react';
import { motion } from 'framer-motion';
import { useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import { Droplets, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { TokenIcon } from './TokenIcon';
import { CONTRACTS, FLUFFY_SWAP_ABI } from '../config/contracts';

interface PoolInfoProps {
  className?: string;
}

export const PoolInfo: React.FC<PoolInfoProps> = ({ className = '' }) => {
  // Get exchange rate
  const { data: tokensPerEth, isError: isRateError } = useContractRead({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'tokensPerEth',
    enabled: true,
    watch: true,
  });

  // Get contract token balance
  const { data: contractTokenBalance, isError: isTokenBalanceError } = useContractRead({
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
      return { status: 'empty', color: 'red', icon: AlertTriangle, message: 'No tokens available' };
    } else if (liquidityLevel < 1000) {
      return { status: 'low', color: 'yellow', icon: AlertTriangle, message: 'Limited swapping capacity' };
    } else if (liquidityLevel < 10000) {
      return { status: 'medium', color: 'blue', icon: TrendingUp, message: 'Good for small swaps' };
    } else {
      return { status: 'high', color: 'green', icon: CheckCircle, message: 'Excellent liquidity depth' };
    }
  };

  const liquidityStatus = getLiquidityStatus();
  const StatusIcon = liquidityStatus.icon;

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <Droplets size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Pool Information
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Liquidity & rates</p>
        </div>
      </div>

      {/* Liquidity Status */}
      <motion.div
        className={`p-4 rounded-2xl border mb-6 ${
          liquidityStatus.color === 'red' 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
          liquidityStatus.color === 'yellow' 
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
          liquidityStatus.color === 'blue' 
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
          'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <StatusIcon size={20} className={`text-${liquidityStatus.color}-600 dark:text-${liquidityStatus.color}-400`} />
          </motion.div>
          <div>
            <p className={`font-semibold capitalize text-${liquidityStatus.color}-800 dark:text-${liquidityStatus.color}-200`}>
              {liquidityStatus.status} Liquidity
            </p>
            <p className={`text-xs text-${liquidityStatus.color}-600 dark:text-${liquidityStatus.color}-400`}>
              {liquidityStatus.message}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pool Stats */}
      <div className="space-y-4">
        {/* Exchange Rate */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-200">Exchange Rate</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">FLUF per ETH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {isRateError ? 'Error' : Number(tokensPerEth || 0).toLocaleString()}
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-500">Rate</p>
            </div>
          </div>
        </motion.div>

        {/* FLUF Tokens */}
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
                <p className="font-semibold text-purple-800 dark:text-purple-200">FLUF Tokens</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Available for swap</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {isTokenBalanceError ? 'Error' : parseFloat(liquidityAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </p>
              <p className="text-xs text-purple-500 dark:text-purple-500">FLUF</p>
            </div>
          </div>
        </motion.div>

        {/* ETH Balance */}
        <motion.div
          className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-4 rounded-2xl border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-blue-500 rounded-full flex items-center justify-center">
                <TokenIcon symbol="ETH" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">ETH Balance</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Contract holdings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
                {parseFloat(ethAmount).toFixed(4)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">ETH</p>
            </div>
          </div>
        </motion.div>

        {/* Pool Health */}
        <motion.div
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <DollarSign size={16} className="text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 dark:text-green-300">Pool Health</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400">Status:</span>
              <span className={`font-medium ${
                hasLiquidity ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {hasLiquidity ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400">Swaps Available:</span>
              <span className={`font-medium ${
                hasLiquidity ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {hasLiquidity ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400">Fees:</span>
              <span className="font-medium text-green-600 dark:text-green-400">0%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Hint */}
      {!hasLiquidity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
        >
          <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center">
            💡 Pool needs liquidity to enable token swapping
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};