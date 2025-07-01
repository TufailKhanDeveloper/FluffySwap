import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACTS, MY_TOKEN_ABI } from '../config/contracts';
import { Plus, ArrowRight, Loader2, CheckCircle, XCircle } from 'lucide-react';

export const LiquidityManager: React.FC = () => {
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
  const canAddLiquidity = liquidityAmount && parseFloat(liquidityAmount) > 0 && parseFloat(liquidityAmount) <= userBalance;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-gray-200 pt-6"
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">Add Liquidity</h3>
            <p className="text-sm text-gray-600">Transfer FLUF tokens to enable swapping</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight size={20} className="text-gray-400" />
        </motion.div>
      </motion.button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 bg-gray-50 rounded-xl"
        >
          <div className="space-y-4">
            {/* Balance Display */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Your FLUF Balance:</span>
              <span className="font-medium text-gray-800">
                {userBalance.toFixed(2)} FLUF
              </span>
            </div>

            {/* Amount Input */}
            <div className="relative">
              <input
                type="number"
                value={liquidityAmount}
                onChange={(e) => setLiquidityAmount(e.target.value)}
                placeholder="Amount to add"
                disabled={isTransferLoading || isTransactionLoading}
                className="w-full p-3 pr-16 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-50"
                step="0.01"
                min="0"
                max={userBalance}
              />
              <button
                onClick={handleMaxClick}
                disabled={isTransferLoading || isTransactionLoading || userBalance === 0}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                MAX
              </button>
            </div>

            {/* Add Liquidity Button */}
            <motion.button
              onClick={handleAddLiquidity}
              disabled={!canAddLiquidity || isTransferLoading || isTransactionLoading}
              whileHover={canAddLiquidity ? { scale: 1.02 } : {}}
              whileTap={canAddLiquidity ? { scale: 0.98 } : {}}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                canAddLiquidity && !isTransferLoading && !isTransactionLoading
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isTransferLoading || isTransactionLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isTransferLoading ? 'Confirming...' : 'Processing...'}
                </>
              ) : isTransactionSuccess ? (
                <>
                  <CheckCircle size={16} />
                  Liquidity Added!
                </>
              ) : transferError ? (
                <>
                  <XCircle size={16} />
                  Transfer Failed
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Liquidity
                </>
              )}
            </motion.button>

            {/* Transaction Hash */}
            {transferData?.hash && (
              <div className="text-center">
                <a
                  href={`https://sepolia.etherscan.io/tx/${transferData.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  View Transaction
                </a>
              </div>
            )}

            {/* Error Display */}
            {transferError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {transferError.message || 'Transfer failed'}
                </p>
              </div>
            )}

            {/* Info */}
            <div className="text-xs text-gray-500 text-center">
              Tokens will be transferred to the FluffySwap contract to provide liquidity for swaps
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};