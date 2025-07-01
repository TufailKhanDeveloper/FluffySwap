import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACTS, MY_TOKEN_ABI } from '../config/contracts';
import { Plus, ArrowRight, Loader2, CheckCircle, XCircle, Droplets, AlertTriangle } from 'lucide-react';

export const LiquidityModule: React.FC = () => {
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { address } = useAccount();

  // Get user's token balance
  const { data: userTokenBalance } = useContractRead({
    address: CONTRACTS.MyToken,
    abi: MY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Get contract token balance for liquidity check
  const { data: contractTokenBalance } = useContractRead({
    address: CONTRACTS.FluffySwap,
    abi: MY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [CONTRACTS.FluffySwap],
    enabled: true,
    watch: true,
  });

  // Transfer tokens to FluffySwap contract
  const {
    write: transferTokens,
    data: transferData,
    isLoading: isTransferLoading,
    error: transferError,
  } = useContractWrite({
    address: CONTRACTS.MyToken,
    abi: MY_TOKEN_ABI,
    functionName: 'transfer',
  });

  // Wait for transfer transaction
  const { 
    isLoading: isTransactionLoading, 
    isSuccess: isTransactionSuccess 
  } = useWaitForTransaction({
    hash: transferData?.hash,
    onSuccess: () => {
      setLiquidityAmount('');
    },
  });

  const handleAddLiquidity = () => {
    if (!liquidityAmount || parseFloat(liquidityAmount) <= 0) return;

    try {
      const amount = parseEther(liquidityAmount);
      transferTokens({
        args: [CONTRACTS.FluffySwap, amount],
      });
    } catch (error) {
      console.error('Transfer error:', error);
    }
  };

  const handleMaxClick = () => {
    if (userTokenBalance) {
      const maxAmount = formatEther(userTokenBalance);
      setLiquidityAmount(maxAmount);
    }
  };

  const userBalance = userTokenBalance ? parseFloat(formatEther(userTokenBalance)) : 0;
  const contractBalance = contractTokenBalance ? parseFloat(formatEther(contractTokenBalance)) : 0;
  const canAddLiquidity = liquidityAmount && parseFloat(liquidityAmount) > 0 && parseFloat(liquidityAmount) <= userBalance;
  const hasLowLiquidity = contractBalance < 1000;

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/30 overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400" />
      
      {/* Low Liquidity Warning */}
      {hasLowLiquidity && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-6 p-4 bg-gradient-to-r from-yellow-50/90 to-orange-50/90 backdrop-blur-sm border border-yellow-200/60 rounded-2xl shadow-lg"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
            </motion.div>
            <div>
              <h4 className="font-bold text-yellow-800 mb-1">Low Liquidity Alert</h4>
              <p className="text-yellow-700 text-sm leading-relaxed">
                Contract has <span className="font-semibold">{contractBalance.toFixed(0)} FLUF</span> tokens. 
                Add more liquidity to enable larger swaps.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus size={20} className="text-white" />
            </motion.div>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Liquidity Management
            </h3>
            <p className="text-sm text-gray-600">Add FLUF tokens to enable swapping</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Pool Balance</p>
            <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {contractBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} FLUF
            </p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={20} className="text-gray-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="space-y-6">
              {/* Balance Display */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-100/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets size={16} className="text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">Your Balance</span>
                  </div>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {userBalance.toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-500">FLUF tokens</p>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm p-4 rounded-2xl border border-purple-100/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Plus size={16} className="text-purple-500" />
                    <span className="text-sm font-medium text-purple-700">Pool Balance</span>
                  </div>
                  <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {contractBalance.toFixed(0)}
                  </p>
                  <p className="text-xs text-purple-500">FLUF available</p>
                </motion.div>
              </div>

              {/* Amount Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Add
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={liquidityAmount}
                    onChange={(e) => setLiquidityAmount(e.target.value)}
                    placeholder="Enter FLUF amount"
                    disabled={isTransferLoading || isTransactionLoading}
                    className="w-full p-4 pr-20 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-50 text-lg font-medium"
                    step="0.01"
                    min="0"
                    max={userBalance}
                  />
                  <motion.button
                    onClick={handleMaxClick}
                    disabled={isTransferLoading || isTransactionLoading || userBalance === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm font-medium text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    MAX
                  </motion.button>
                </div>
              </div>

              {/* Add Liquidity Button */}
              <motion.button
                onClick={handleAddLiquidity}
                disabled={!canAddLiquidity || isTransferLoading || isTransactionLoading}
                whileHover={canAddLiquidity ? { scale: 1.02 } : {}}
                whileTap={canAddLiquidity ? { scale: 0.98 } : {}}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                  canAddLiquidity && !isTransferLoading && !isTransactionLoading
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isTransferLoading || isTransactionLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {isTransferLoading ? 'Confirming...' : 'Processing...'}
                  </>
                ) : isTransactionSuccess ? (
                  <>
                    <CheckCircle size={20} />
                    Liquidity Added!
                  </>
                ) : transferError ? (
                  <>
                    <XCircle size={20} />
                    Transfer Failed
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Add Liquidity
                  </>
                )}
              </motion.button>

              {/* Transaction Hash */}
              {transferData?.hash && (
                <div className="text-center">
                  <motion.a
                    href={`https://sepolia.etherscan.io/tx/${transferData.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 underline"
                  >
                    <span>View Transaction</span>
                    <ArrowRight size={14} />
                  </motion.a>
                </div>
              )}

              {/* Error Display */}
              {transferError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle size={16} className="text-red-500" />
                    <span className="font-medium text-red-700">Transaction Failed</span>
                  </div>
                  <p className="text-sm text-red-600">
                    {transferError.message || 'Transfer failed'}
                  </p>
                </motion.div>
              )}

              {/* Info */}
              <motion.div
                className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border border-blue-100/50 rounded-2xl"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Droplets size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">How it works</p>
                    <p className="text-xs text-blue-600 leading-relaxed">
                      Tokens will be transferred to the FluffySwap contract to provide liquidity for swaps. 
                      More liquidity enables larger swap amounts and better user experience.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};