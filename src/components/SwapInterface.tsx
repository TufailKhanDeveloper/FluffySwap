import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useBalance, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ArrowDownUp, Loader2, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { TokenIcon } from './TokenIcon';
import { TransactionStatus, TransactionState } from './TransactionStatus';
import { CONTRACTS, FLUFFY_SWAP_ABI, MY_TOKEN_ABI, SWAP_LIMITS } from '../config/contracts';
import toast from 'react-hot-toast';

interface SwapInterfaceProps {
  className?: string;
}

export const SwapInterface: React.FC<SwapInterfaceProps> = ({ className = '' }) => {
  const [ethAmount, setEthAmount] = useState('');
  const [flufAmount, setFlufAmount] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [inputError, setInputError] = useState<string>('');
  const [transactionState, setTransactionState] = useState<TransactionState>('idle');
  const [txHash, setTxHash] = useState<string>('');

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
    error: flufBalanceError,
    refetch: refetchFlufBalance
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

  // Get exchange rate
  const { 
    data: tokensPerEth, 
    isError: isRateError,
    error: rateError 
  } = useContractRead({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'tokensPerEth',
    enabled: true,
    watch: true,
    onError: (error) => {
      console.error('Rate read error:', error);
    },
  });

  // Get contract liquidity
  const { 
    data: contractLiquidity,
    isError: isLiquidityError,
    refetch: refetchLiquidity
  } = useContractRead({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'getTokenBalance',
    enabled: true,
    watch: true,
  });

  // Swap transaction
  const {
    write: executeSwap,
    data: swapData,
    isLoading: isSwapLoading,
    error: swapError,
    reset: resetSwap
  } = useContractWrite({
    address: CONTRACTS.FluffySwap,
    abi: FLUFFY_SWAP_ABI,
    functionName: 'swapEthForTokens',
  });

  // Wait for transaction
  const { 
    isLoading: isTransactionLoading, 
    isSuccess: isTransactionSuccess,
    isError: isTransactionError
  } = useWaitForTransaction({
    hash: swapData?.hash,
    onSuccess: (data) => {
      console.log('Transaction successful:', data);
      setTransactionState('success');
      setEthAmount('');
      setFlufAmount('');
      // Refetch balances after successful transaction
      refetchFlufBalance();
      refetchLiquidity();
    },
    onError: (error) => {
      console.error('Transaction failed:', error);
      setTransactionState('error');
    },
  });

  // Calculate FLUF amount when ETH amount changes
  useEffect(() => {
    if (ethAmount && tokensPerEth && parseFloat(ethAmount) > 0 && !isRateError) {
      setIsCalculating(true);
      const timeoutId = setTimeout(() => {
        try {
          const ethValue = parseFloat(ethAmount);
          const rate = Number(tokensPerEth);
          const calculatedFluf = ethValue * rate;
          setFlufAmount(calculatedFluf.toFixed(6));
        } catch (error) {
          console.error('Calculation error:', error);
          setFlufAmount('0');
        }
        setIsCalculating(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setFlufAmount('');
      setIsCalculating(false);
    }
  }, [ethAmount, tokensPerEth, isRateError]);

  // Update transaction state based on swap status
  useEffect(() => {
    if (swapData?.hash && !txHash) {
      setTxHash(swapData.hash);
      setTransactionState('pending');
    }
  }, [swapData, txHash]);

  useEffect(() => {
    if (isTransactionSuccess) {
      setTransactionState('success');
    } else if (isTransactionError || swapError) {
      setTransactionState('error');
    }
  }, [isTransactionSuccess, isTransactionError, swapError]);

  // Validate input
  useEffect(() => {
    if (!ethAmount || parseFloat(ethAmount) === 0) {
      setInputError('');
      return;
    }

    const amount = parseFloat(ethAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setInputError('Please enter a valid amount');
      return;
    }

    if (amount < parseFloat(SWAP_LIMITS.MIN_ETH)) {
      setInputError(`Minimum swap amount is ${SWAP_LIMITS.MIN_ETH} ETH`);
      return;
    }

    if (amount > parseFloat(SWAP_LIMITS.MAX_ETH)) {
      setInputError(`Maximum swap amount is ${SWAP_LIMITS.MAX_ETH} ETH`);
      return;
    }

    if (ethBalance && amount > parseFloat(formatEther(ethBalance.value))) {
      setInputError('Insufficient ETH balance');
      return;
    }

    if (contractLiquidity && flufAmount) {
      const requiredFluf = parseFloat(flufAmount);
      const availableFluf = parseFloat(formatEther(contractLiquidity));
      if (requiredFluf > availableFluf) {
        setInputError('Insufficient liquidity');
        return;
      }
    }

    setInputError('');
  }, [ethAmount, flufAmount, ethBalance, contractLiquidity]);

  const handleSwap = () => {
    if (!isConnected || !ethAmount || inputError) return;

    try {
      // Reset previous transaction state
      resetSwap();
      setTransactionState('idle');
      setTxHash('');
      
      executeSwap({
        value: parseEther(ethAmount),
      });
    } catch (error) {
      console.error('Swap error:', error);
      setTransactionState('error');
    }
  };

  const handleMaxClick = () => {
    if (ethBalance) {
      const maxAmount = Math.min(
        parseFloat(formatEther(ethBalance.value)) - 0.01, // Reserve for gas
        parseFloat(SWAP_LIMITS.MAX_ETH)
      );
      setEthAmount(Math.max(0, maxAmount).toString());
    }
  };

  const handleTransactionStateChange = (newState: TransactionState) => {
    setTransactionState(newState);
    if (newState === 'idle') {
      setTxHash('');
      resetSwap();
    }
  };

  const isLoading = isSwapLoading || isTransactionLoading;
  const canSwap = isConnected && ethAmount && !inputError && !isLoading;
  const hasLiquidity = contractLiquidity && Number(formatEther(contractLiquidity)) > 0;

  // Format FLUF balance properly
  const formatFlufBalance = (balance: bigint | undefined): string => {
    if (!balance) return '0';
    try {
      const formatted = formatEther(balance);
      const num = parseFloat(formatted);
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    } catch (error) {
      console.error('Error formatting FLUF balance:', error);
      return '0';
    }
  };

  return (
    <>
      <motion.div
        className={`bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-3 rounded-full mb-6 border border-pink-200"
            whileHover={{ scale: 1.02 }}
          >
            <TokenIcon symbol="FLUF" size={24} className="text-pink-500" animated />
            <span className="font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Token Swap
            </span>
            <TokenIcon symbol="ETH" size={24} className="text-blue-500" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Swap ETH for FLUF
          </h2>
          <p className="text-gray-600">
            Trade Ethereum for FluffyTokens instantly
          </p>
        </div>

        {/* Error Alerts */}
        <AnimatePresence>
          {(isFlufBalanceError || isRateError || isLiquidityError) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">
                    Contract Connection Issues
                  </h4>
                  <div className="text-sm text-red-600 space-y-1">
                    {isFlufBalanceError && (
                      <p>• Failed to read FLUF balance: {flufBalanceError?.message}</p>
                    )}
                    {isRateError && (
                      <p>• Failed to read exchange rate: {rateError?.message}</p>
                    )}
                    {isLiquidityError && (
                      <p>• Failed to read contract liquidity</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swap Interface */}
        <div className="space-y-6">
          {/* ETH Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              You Pay
            </label>
            <div className={`relative rounded-2xl border-2 transition-all duration-300 ${
              inputError 
                ? 'border-red-300' 
                : 'border-gray-200 focus-within:border-pink-300'
            }`}>
              <div className="flex items-center p-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <TokenIcon symbol="ETH" size={20} className="text-white" />
                  </div>
                  <input
                    type="number"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    placeholder="0.0"
                    disabled={isLoading}
                    className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none placeholder-gray-400 text-gray-900"
                    step="0.001"
                    min="0"
                  />
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    ETH
                  </span>
                </div>
                {ethBalance && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMaxClick}
                    disabled={isLoading}
                    className="ml-3 px-3 py-1 text-sm font-medium text-pink-600 bg-pink-100 rounded-full hover:bg-pink-200 transition-colors disabled:opacity-50"
                  >
                    MAX
                  </motion.button>
                )}
              </div>
            </div>
            
            {/* Balance and Error */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                {ethBalance ? `Balance: ${parseFloat(formatEther(ethBalance.value)).toFixed(4)} ETH` : ''}
              </span>
              {inputError && (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertTriangle size={14} />
                  {inputError}
                </span>
              )}
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: isCalculating ? 360 : 0 }}
              transition={{ duration: 1, repeat: isCalculating ? Infinity : 0 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center shadow-lg"
            >
              <ArrowDownUp size={20} className="text-white" />
            </motion.div>
          </div>

          {/* FLUF Output */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              You Receive
            </label>
            <div className="rounded-2xl border-2 border-gray-200 bg-gray-50">
              <div className="flex items-center p-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                    <TokenIcon symbol="FLUF" size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    {isCalculating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 size={20} className="animate-spin text-gray-400" />
                        <span className="text-gray-400">Calculating...</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-semibold text-gray-700">
                        {flufAmount || '0.0'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    FLUF
                  </span>
                </div>
              </div>
            </div>
            
            {/* FLUF Balance */}
            <div className="text-sm text-gray-500">
              {isFlufBalanceError ? (
                'Unable to load FLUF balance'
              ) : flufBalance ? (
                `Balance: ${formatFlufBalance(flufBalance)} FLUF`
              ) : (
                'Balance: 0 FLUF'
              )}
            </div>
          </div>

          {/* Swap Button */}
          <motion.button
            onClick={handleSwap}
            disabled={!canSwap || !hasLiquidity}
            whileHover={canSwap && hasLiquidity ? { scale: 1.02 } : {}}
            whileTap={canSwap && hasLiquidity ? { scale: 0.98 } : {}}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              canSwap && hasLiquidity
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {isSwapLoading ? 'Confirming...' : 'Processing...'}
              </>
            ) : !isConnected ? (
              <>
                <Sparkles size={20} />
                Connect Wallet
              </>
            ) : !hasLiquidity ? (
              <>
                <AlertTriangle size={20} />
                Insufficient Liquidity
              </>
            ) : transactionState === 'success' ? (
              <>
                <CheckCircle size={20} />
                Swap Completed!
              </>
            ) : (
              <>
                <ArrowDownUp size={20} />
                Swap Tokens
              </>
            )}
          </motion.button>

          {/* Transaction Hash */}
          {txHash && (
            <div className="text-center">
              <motion.a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-800 underline"
              >
                View Transaction
                <ArrowDownUp size={14} />
              </motion.a>
            </div>
          )}

          {/* Swap Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>Min: {SWAP_LIMITS.MIN_ETH} ETH</span>
              <span>•</span>
              <span>Max: {SWAP_LIMITS.MAX_ETH} ETH</span>
            </div>
            <p className="text-xs text-gray-400">
              Network fees apply • All transactions are final
            </p>
          </div>
        </div>
      </motion.div>

      {/* Transaction Status */}
      <TransactionStatus
        state={transactionState}
        hash={txHash}
        error={swapError?.message}
        onClose={() => setTransactionState('idle')}
        onStateChange={handleTransactionStateChange}
      />
    </>
  );
};