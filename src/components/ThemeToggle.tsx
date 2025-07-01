import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/**
 * Enhanced Theme Toggle Component
 * 
 * Features:
 * - Three-state toggle: light, dark, system
 * - Smooth animations and transitions
 * - Visual feedback for current theme
 * - Accessibility support with proper ARIA labels
 * - Responsive design for mobile and desktop
 */
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light Mode' },
    { value: 'dark', icon: Moon, label: 'Dark Mode' },
    { value: 'system', icon: Monitor, label: 'System Theme' },
  ] as const;

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 transition-all duration-300 shadow-inner">
        {themes.map(({ value, icon: Icon, label }) => (
          <motion.button
            key={value}
            onClick={() => setTheme(value)}
            className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
              theme === value
                ? 'text-white shadow-lg'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            whileHover={{ scale: theme === value ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
            title={label}
          >
            {theme === value && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg"
                initial={false}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.3
                }}
              />
            )}
            <motion.div
              className="relative z-10"
              animate={{ 
                rotate: theme === value ? (value === 'dark' ? 180 : 0) : 0,
                scale: theme === value ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon size={16} />
            </motion.div>
          </motion.button>
        ))}
      </div>
      
      {/* Theme Status Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
      >
        {theme === 'system' ? (isDark ? 'System (Dark)' : 'System (Light)') : 
         theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </motion.div>
    </div>
  );
};