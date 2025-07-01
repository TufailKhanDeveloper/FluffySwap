import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Coins } from 'lucide-react';
import { SWAP_LIMITS } from '../config/contracts';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean, error?: string) => void;
  disabled?: boolean;
  balance?: string;
  tokenAmount?: string;
  isCalculating?: boolean;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  onValidationChange,
  disabled = false,
  balance,
  tokenAmount,
  isCalculating = false,
}) => {
  const [error, setError] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounced validation
  const validateInput = useCallback((inputValue: string) => {
    if (!inputValue || inputValue === '0') {
      setError('');
      onValidationChange(false, 'Enter an amount');
      return;
    }

    const numValue = parseFloat(inputValue);
    
    if (isNaN(numValue) || numValue <= 0) {
      setError('Please enter a valid amount');
      onValidationChange(false, 'Please enter a valid amount');
      return;
    }

    if (numValue < parseFloat(SWAP_LIMITS.MIN_ETH)) {
      setError(`Minimum swap amount is ${SWAP_LIMITS.MIN_ETH} ETH`);
      onValidationChange(false, `Minimum swap amount is ${SWAP_LIMITS.MIN_ETH} ETH`);
      return;
    }

    if (numValue > parseFloat(SWAP_LIMITS.MAX_ETH)) {
      setError(`Maximum swap amount is ${SWAP_LIMITS.MAX_ETH} ETH`);
      onValidationChange(false, `Maximum swap amount is ${SWAP_LIMITS.MAX_ETH} ETH`);
      return;
    }

    if (balance && numValue > parseFloat(balance)) {
      setError('Insufficient ETH balance');
      onValidationChange(false, 'Insufficient ETH balance');
      return;
    }

    setError('');
    onValidationChange(true);
  }, [balance, onValidationChange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateInput(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, validateInput]);

  const handleMaxClick = () => {
    if (balance) {
      const maxAmount = Math.min(parseFloat(balance), parseFloat(SWAP_LIMITS.MAX_ETH));
      onChange(maxAmount.toString());
    }
  };

  return (
    <div className="space-y-4">
      {/* ETH Input */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          You Pay
        </label>
        <div
          className={`relative rounded-2xl border-2 transition-all duration-300 ${
            isFocused
              ? 'border-pink-300 shadow-lg shadow-pink-100'
              : error
              ? 'border-red-300'
              : 'border-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center p-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ETH</span>
              </div>
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="0.0"
                disabled={disabled}
                className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none placeholder-gray-400"
                step="0.001"
                min="0"
              />
            </div>
            {balance && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMaxClick}
                disabled={disabled}
                className="px-3 py-1 text-sm font-medium text-pink-600 bg-pink-100 rounded-full hover:bg-pink-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                MAX
              </motion.button>
            )}
          </div>
        </div>
        {balance && (
          <p className="text-sm text-gray-500 mt-1">
            Balance: {parseFloat(balance).toFixed(4)} ETH
          </p>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-500 text-sm mt-2"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center">
        <motion.div
          animate={{ rotate: isCalculating ? 360 : 0 }}
          transition={{ duration: 1, repeat: isCalculating ? Infinity : 0 }}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-center shadow-lg"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>

      {/* FLUF Output */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          You Receive
        </label>
        <div className="rounded-2xl border-2 border-gray-200 bg-gray-50">
          <div className="flex items-center p-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                <Coins size={16} className="text-white" />
              </div>
              <div className="flex-1">
                {isCalculating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse bg-gray-300 h-8 w-24 rounded"></div>
                    <span className="text-gray-400">Calculating...</span>
                  </div>
                ) : (
                  <span className="text-2xl font-semibold text-gray-700">
                    {tokenAmount || '0.0'}
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full">
              FLUF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};