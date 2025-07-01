import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 transition-colors">
        {themes.map(({ value, icon: Icon, label }) => (
          <motion.button
            key={value}
            onClick={() => setTheme(value)}
            className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              theme === value
                ? 'text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${label} theme`}
          >
            {theme === value && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Icon size={16} className="relative z-10" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};