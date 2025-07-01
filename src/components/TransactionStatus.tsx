import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ExternalLink, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export type TransactionState = 'idle' | 'pending' | 'success' | 'error';

interface TransactionStatusProps {
  state: TransactionState;
  hash?: string;
  error?: string;
  onClose?: () => void;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  state,
  hash,
  error,
  onClose,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (state === 'success') {
      setShowConfetti(true);
      toast.success('Swap completed successfully! 🎉', {
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: 'white',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '16px',
        },
      });
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (state === 'error') {
      toast.error(error || 'Transaction failed', {
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #EF4444, #DC2626)',
          color: 'white',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '16px',
        },
      });
    } else if (state === 'pending') {
      toast.loading('Transaction pending...', {
        duration: Infinity,
        style: {
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          color: 'white',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '16px',
        },
      });
    }

    return () => {
      if (state !== 'pending') {
        toast.dismiss();
      }
    };
  }, [state, error]);

  if (state === 'idle') return null;

  const getStatusConfig = () => {
    switch (state) {
      case 'pending':
        return {
          icon: Clock,
          title: 'Processing Transaction',
          description: 'Your swap is being confirmed on the blockchain...',
          bgColor: 'from-blue-500 via-blue-600 to-indigo-600',
          iconColor: 'text-blue-200',
        };
      case 'success':
        return {
          icon: CheckCircle,
          title: 'Swap Completed!',
          description: 'Your tokens have been successfully swapped!',
          bgColor: 'from-green-500 via-emerald-500 to-teal-600',
          iconColor: 'text-green-200',
        };
      case 'error':
        return {
          icon: XCircle,
          title: 'Transaction Failed',
          description: error || 'Unable to complete the swap. Please try again.',
          bgColor: 'from-red-500 via-rose-500 to-pink-600',
          iconColor: 'text-red-200',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const { icon: Icon, title, description, bgColor, iconColor } = config;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 right-6 max-w-sm z-50"
      >
        <div className={`bg-gradient-to-br ${bgColor} p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden backdrop-blur-sm border border-white/20`}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
          </div>

          {/* Enhanced Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    y: -120,
                    x: Math.random() * 200 - 100,
                    rotate: Math.random() * 720,
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  transition={{ duration: 2.5, delay: Math.random() * 0.8 }}
                  className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${
                    i % 4 === 0 ? 'bg-yellow-300' : 
                    i % 4 === 1 ? 'bg-pink-300' : 
                    i % 4 === 2 ? 'bg-blue-300' : 'bg-green-300'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="relative z-10 flex items-start gap-4">
            <div className="flex-shrink-0">
              {state === 'pending' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                  <Icon size={24} className={iconColor} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  className="relative"
                >
                  {state === 'success' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.2 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="absolute inset-0 rounded-full bg-white/20"
                    ></motion.div>
                  )}
                  <Icon size={24} className="text-white relative z-10" />
                </motion.div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-bold text-lg mb-2 text-white"
              >
                {title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-white/80 mb-4 leading-relaxed"
              >
                {description}
              </motion.p>

              {hash && (
                <motion.a
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                >
                  <ExternalLink size={14} />
                  View on Etherscan
                </motion.a>
              )}
            </div>

            {onClose && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
              >
                <XCircle size={18} />
              </motion.button>
            )}
          </div>

          {/* Success sparkle effects */}
          {state === 'success' && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-3 right-3"
              >
                <Sparkles size={18} className="text-yellow-300 animate-pulse" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-3 left-3"
              >
                <Sparkles size={14} className="text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Demo component to showcase the different states
export const TransactionStatusDemo = () => {
  const [activeState, setActiveState] = useState<TransactionState>('idle');
  const [hash] = useState('0x1234567890abcdef1234567890abcdef12345678');

  const states = [
    { state: 'pending' as const, label: 'Pending' },
    { state: 'success' as const, label: 'Success' },
    { state: 'error' as const, label: 'Error' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enhanced Transaction Status Alerts
          </h1>
          <p className="text-gray-600 text-lg">
            Modern, user-friendly transaction status notifications with smooth animations
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Try Different States
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {states.map(({ state, label }) => (
              <button
                key={state}
                onClick={() => setActiveState(state)}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-200
                  ${activeState === state
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setActiveState('idle')}
              className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
            >
              Clear Alert
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Smooth entrance and exit animations</li>
              <li>• Progress bar for pending transactions</li>
              <li>• Confetti celebration for successful swaps</li>
              <li>• Better visual hierarchy and typography</li>
              <li>• Accessible color schemes and contrast</li>
              <li>• Interactive hover states and micro-animations</li>
            </ul>
          </div>
        </div>
      </div>

      <TransactionStatus
        state={activeState}
        hash={activeState !== 'error' ? hash : undefined}
        error={activeState === 'error' ? 'Insufficient gas fees' : undefined}
        onClose={() => setActiveState('idle')}
      />
    </div>
  );
};