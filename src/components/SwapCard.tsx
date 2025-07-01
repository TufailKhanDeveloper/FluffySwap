import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useBalance, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { TokenInput } from './TokenInput';
import { SwapButton } from './SwapButton';
import { TransactionStatus, TransactionState } from './TransactionStatus';
import { LiquidityManager } from './LiquidityManager';
import { CONTRACTS, FLUFFY_SWAP_ABI, MY_TOKEN_ABI } from '../config/contracts';
import { Sparkles, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

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

// FLUF Token Icon Component (Custom cute fluffy icon)
const FlufIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Fluffy cloud-like token design */}
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
    <circle cx="8" cy="10" r="3" fill="currentColor" fillOpacity="0.4" />
    <circle cx="16" cy="10" r="3" fill="currentColor" fillOpacity="0.4" />
    <circle cx="12" cy="14" r="4" fill="currentColor" fillOpacity="0.6" />
    <circle cx="6" cy="14" r="2" fill="currentColor" fillOpacity="0.3" />
    <circle cx="18" cy="14" r="2" fill="currentColor" fillOpacity="0.3" />
    <circle cx="12" cy="8" r="2.5" fill="currentColor" fillOpacity="0.5" />
    {/* Sparkle effects */}
    <circle cx="15" cy="7" r="0.5" fill="currentColor" />
    <circle cx="9" cy="6" r="0.5" fill="currentColor" />
    <circle cx="17" cy="17" r="0.5" fill="currentColor" />
    <circle cx="7" cy="18" r="0.5" fill="currentColor" />
  </svg>
);

export const SwapCard: React.FC = () => {
  const [ethAmount, setEthAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [inputError, setInputError] = useState<string>('');
  const [transactionState, setTransactionState] = useState<TransactionState>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  const { address, isConnected } = useAccount();

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address,
    watch: true,
  });

  // Get FLUF token balance - with error handling
  const { 
    data: tokenBalance, 
    error: tokenBalanceError,
    isError: isTokenBalanceError 
  } = useContractRead({
    address: CONTRACTS.MyToken,
    abi: MY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Get current token rate - with error handling
  const { 
    data: tokenRate, 
    error: tokenRateError,
    isError: isTokenRateError 
  } = useContractRead({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'tokensPerEth',
    enabled: true,
    watch: true,
  });

  // Get contract token balance for liquidity check
  const { 
    data: contractTokenBalance, 
    error: contractBalanceError,
    isError: isContractBalanceError 
  } = useContractRead({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'getTokenBalance',
    enabled: true,
    watch: true,
  });

  // Debug: Log contract read results
  useEffect(() => {
    console.log('Token Balance:', tokenBalance, 'Error:', tokenBalanceError);
    console.log('Token Rate:', tokenRate, 'Error:', tokenRateError);
    console.log('Contract Token Balance:', contractTokenBalance, 'Error:', contractBalanceError);
  }, [tokenBalance, tokenBalanceError, tokenRate, tokenRateError, contractTokenBalance, contractBalanceError]);

  // Helper function to safely format bigint values
  const formatTokenValue = (value: unknown): string => {
    try {
      if (!value) return '0';
      
      // Handle bigint directly
      if (typeof value === 'bigint') {
        return parseFloat(formatEther(value)).toLocaleString();
      }
      
      // Handle string representation of numbers
      if (typeof value === 'string') {
        const bigintValue = BigInt(value);
        return parseFloat(formatEther(bigintValue)).toLocaleString();
      }
      
      // Handle number
      if (typeof value === 'number') {
        const bigintValue = BigInt(Math.floor(value));
        return parseFloat(formatEther(bigintValue)).toLocaleString();
      }
      
      return '0';
    } catch (error) {
      console.error('Format error:', error, 'Value:', value, 'Type:', typeof value);
      return '0';
    }
  };

  // Calculate token amount when ETH amount changes
  useEffect(() => {
    if (ethAmount && tokenRate && parseFloat(ethAmount) > 0 && !isTokenRateError) {
      setIsCalculating(true);
      const timeoutId = setTimeout(() => {
        try {
          const ethValue = parseFloat(ethAmount);
          
          // More robust rate handling
          let rateValue = 0;
          if (typeof tokenRate === 'bigint') {
            rateValue = Number(tokenRate);
          } else if (typeof tokenRate === 'string') {
            rateValue = Number(tokenRate);
          } else if (typeof tokenRate === 'number') {
            rateValue = tokenRate;
          }
          
          const calculatedTokens = ethValue * rateValue;
          setTokenAmount(calculatedTokens.toFixed(6));
        } catch (error) {
          console.error('Token calculation error:', error);
          setTokenAmount('0');
        }
        setIsCalculating(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setTokenAmount('');
      setIsCalculating(false);
    }
  }, [ethAmount, tokenRate, isTokenRateError]);

  // Contract write for swap
  const {
    write: swapTokens,
    data: swapData,
    isLoading: isSwapLoading,
    error: swapError,
  } = useContractWrite({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'swapEthForTokens',
  });

  // Wait for transaction
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransaction({
    hash: swapData?.hash,
    onSuccess: () => {
      setTransactionState('success');
      setEthAmount('');
      setTokenAmount('');
    },
    onError: () => {
      setTransactionState('error');
    },
  });

  // Update transaction state
  useEffect(() => {
    if (swapData?.hash) {
      setTxHash(swapData.hash);
      setTransactionState('pending');
    }
  }, [swapData]);

  useEffect(() => {
    if (isTransactionLoading) {
      setTransactionState('pending');
    }
  }, [isTransactionLoading]);

  useEffect(() => {
    if (swapError) {
      console.error('Swap Error:', swapError);
      setTransactionState('error');
    }
  }, [swapError]);

  const handleSwap = () => {
    if (!isConnected || !ethAmount || !isValidInput) return;

    try {
      swapTokens({
        value: parseEther(ethAmount),
      });
    } catch (error) {
      console.error('Swap error:', error);
      setTransactionState('error');
    }
  };

  const handleValidationChange = (isValid: boolean, error?: string) => {
    setIsValidInput(isValid);
    setInputError(error || '');
  };

  const isButtonDisabled = !isConnected || !isValidInput || isSwapLoading || isTransactionLoading || !ethAmount;

  // Check if contract has sufficient liquidity
  const hasLiquidity = contractTokenBalance && Number(formatEther(contractTokenBalance)) > 0;
  const liquidityAmount = contractTokenBalance ? formatEther(contractTokenBalance) : '0';

  return (
    <div className="relative max-w-md mx-auto">
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-cyan-400/20 rounded-3xl blur-xl"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2), rgba(34, 211, 238, 0.2))',
            'linear-gradient(90deg, rgba(236, 72, 153, 0.2), rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2))',
            'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
            'linear-gradient(45deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2), rgba(34, 211, 238, 0.2))',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl" />

        {/* Header with Icons */}
        <div className="text-center mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 15,
              delay: 0.2
            }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-white/40 shadow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <FlufIcon size={24} className="text-purple-500" />
            </motion.div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              FluffySwap
            </span>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <FlufIcon size={24} className="text-pink-500" />
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 px-4 py-2 rounded-full border border-blue-200/50">
              <EthIcon size={20} className="text-blue-600" />
              <span className="font-semibold text-blue-800">ETH</span>
            </div>
            
            <motion.div
              animate={{ rotate: 180 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              <TrendingUp size={20} className="text-gray-400" />
            </motion.div>
            
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100/80 to-pink-100/80 px-4 py-2 rounded-full border border-purple-200/50">
              <FlufIcon size={20} className="text-purple-600" />
              <span className="font-semibold text-purple-800">FLUF</span>
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3"
          >
            Swap ETH for FLUF
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-lg"
          >
            Trade Ethereum for FluffyTokens instantly
          </motion.p>
        </div>

        {/* Liquidity Warning */}
        {!hasLiquidity && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-6 p-5 bg-gradient-to-r from-yellow-50/90 to-orange-50/90 backdrop-blur-sm border border-yellow-200/60 rounded-2xl shadow-lg"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle size={24} className="text-yellow-600 mt-1" />
              </motion.div>
              <div>
                <h3 className="font-bold text-yellow-800 text-lg mb-2">Low Liquidity Alert</h3>
                <p className="text-yellow-700 leading-relaxed">
                  Contract has <span className="font-semibold">{parseFloat(liquidityAmount).toFixed(2)} FLUF</span> tokens available. 
                  Add liquidity below to enable swapping functionality.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Debug Information */}
        {(isTokenRateError || isTokenBalanceError || isContractBalanceError) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-5 bg-gradient-to-r from-red-50/90 to-pink-50/90 backdrop-blur-sm border border-red-200/60 rounded-2xl shadow-lg"
          >
            <h3 className="font-bold text-red-800 mb-3 text-lg flex items-center gap-2">
              <AlertTriangle size={20} />
              Contract Read Errors
            </h3>
            <div className="space-y-2">
              {isTokenRateError && (
                <p className="text-sm text-red-600 bg-red-100/50 p-2 rounded-lg">
                  <span className="font-medium">Rate Error:</span> {tokenRateError?.message || 'Unknown error'}
                </p>
              )}
              {isTokenBalanceError && (
                <p className="text-sm text-red-600 bg-red-100/50 p-2 rounded-lg">
                  <span className="font-medium">Balance Error:</span> {tokenBalanceError?.message || 'Unknown error'}
                </p>
              )}
              {isContractBalanceError && (
                <p className="text-sm text-red-600 bg-red-100/50 p-2 rounded-lg">
                  <span className="font-medium">Contract Balance Error:</span> {contractBalanceError?.message || 'Unknown error'}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Enhanced Stats with Icons */}
        {tokenRate && !isTokenRateError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, staggerChildren: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-blue-50/90 to-cyan-50/90 backdrop-blur-sm p-5 rounded-2xl border border-blue-100/50 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp size={20} className="text-blue-500" />
                </motion.div>
                <span className="text-sm font-semibold text-gray-600">Exchange Rate</span>
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {Number(tokenRate).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <FlufIcon size={12} className="text-purple-500" />
                <span className="text-xs text-gray-500">per</span>
                <EthIcon size={12} className="text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm p-5 rounded-2xl border border-green-100/50 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FlufIcon size={20} className="text-green-500" />
                </motion.div>
                <span className="text-sm font-semibold text-gray-600">Your Balance</span>
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {isTokenBalanceError ? 'Error' : formatTokenValue(tokenBalance)}
              </p>
              <p className="text-xs text-gray-500 mt-1">FLUF tokens</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-sm p-5 rounded-2xl border border-purple-100/50 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <FlufIcon size={20} className="text-purple-500" />
                </motion.div>
                <span className="text-sm font-semibold text-gray-600">Pool Liquidity</span>
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isContractBalanceError ? 'Error' : parseFloat(liquidityAmount).toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">FLUF available</p>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Swap Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative"
        >
          <TokenInput
            value={ethAmount}
            onChange={setEthAmount}
            onValidationChange={handleValidationChange}
            disabled={isSwapLoading || isTransactionLoading}
            balance={ethBalance ? formatEther(ethBalance.value) : undefined}
            tokenAmount={tokenAmount}
            isCalculating={isCalculating}
          />
        </motion.div>

        {/* Enhanced Token Calculation Display with Icons */}
        {tokenAmount && ethAmount && !isCalculating && !isTokenRateError && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-gray-50/90 to-green-50/90 backdrop-blur-sm border border-gray-200/50 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">You will receive:</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {parseFloat(tokenAmount).toLocaleString()}
                </span>
                <FlufIcon size={24} className="text-purple-500" />
                <span className="text-green-600 font-semibold">FLUF</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Swap Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <SwapButton
            onClick={handleSwap}
            disabled={isButtonDisabled || !hasLiquidity}
            isLoading={isSwapLoading || isTransactionLoading}
            error={!hasLiquidity ? 'Insufficient liquidity' : inputError}
            isConnected={isConnected}
          />
        </motion.div>

        {/* Enhanced Liquidity Manager */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8"
          >
            <LiquidityManager />
          </motion.div>
        )}

        {/* Enhanced Additional Info with Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-8 text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1 bg-gray-100/50 px-3 py-1 rounded-full">
              <span>Min: 0.001</span>
              <EthIcon size={14} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-1 bg-gray-100/50 px-3 py-1 rounded-full">
              <span>Max: 10</span>
              <EthIcon size={14} className="text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Network fees apply • All transactions are final and irreversible
          </p>
        </motion.div>
      </motion.div>

      {/* Transaction Status */}
      <TransactionStatus
        state={transactionState}
        hash={txHash}
        error={swapError?.message}
        onClose={() => setTransactionState('idle')}
      />
    </div>
  );
};