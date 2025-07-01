import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Loader2, Sparkles } from 'lucide-react';

interface SwapButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  error?: string;
  isConnected: boolean;
}

export const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  error,
  isConnected,
}) => {
  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (isLoading) return 'Swapping...';
    if (error) return error;
    return 'Swap Tokens';
  };

  const getButtonIcon = () => {
    if (isLoading) return <Loader2 size={20} className="animate-spin" />;
    if (!isConnected) return <Sparkles size={20} />;
    return <ArrowRightLeft size={20} />;
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : isLoading
          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
          : error
          ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white'
          : 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white'
      }`}
    >
      {getButtonIcon()}
      {getButtonText()}
      {!disabled && !isLoading && !error && (
        <Sparkles size={16} className="animate-pulse" />
      )}
    </motion.button>
  );
};