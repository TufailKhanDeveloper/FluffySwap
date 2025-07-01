import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, ExternalLink } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { ThemeToggle } from './ThemeToggle';
import { FAUCET_LINKS } from '../config/contracts';

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 pt-8 pb-4"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{
                boxShadow: [
                  '0 4px 20px rgba(236, 72, 153, 0.3)',
                  '0 8px 30px rgba(168, 85, 247, 0.4)',
                  '0 4px 20px rgba(236, 72, 153, 0.3)',
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart size={24} className="text-white" fill="currentColor" />
              </motion.div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FluffySwap
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kawaii DEX</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <motion.a
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
              }}
              whileTap={{ scale: 0.9 }}
              href={FAUCET_LINKS.sepolia}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium transition-all duration-200 border border-blue-200 dark:border-blue-800"
            >
              <ExternalLink size={16} />
              Get Testnet ETH
            </motion.a>
            
            <motion.a
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 6px 20px rgba(107, 114, 128, 0.3)'
              }}
              whileTap={{ scale: 0.9 }}
              href="https://github.com/your-repo/fluffyswap"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 border border-gray-200 dark:border-gray-700"
            >
              <Github size={20} />
            </motion.a>
            
            <WalletConnect />
          </div>
        </div>
      </div>
    </motion.header>
  );
};