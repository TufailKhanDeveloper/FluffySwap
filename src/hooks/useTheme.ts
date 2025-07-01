import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeHook {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

/**
 * Enhanced Theme Hook with Complete Dark Mode Support
 * 
 * Features:
 * - Supports light, dark, and system themes
 * - Persists theme preference in localStorage
 * - Automatically detects system theme changes
 * - Provides utility functions for theme management
 * - Ensures smooth transitions between themes
 * - Updates document classes and CSS variables
 * - Properly handles body and html background transitions
 * 
 * @returns {ThemeHook} Theme state and control functions
 */
export const useTheme = (): ThemeHook => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fluffyswap-theme') as Theme;
      return stored || 'system';
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const updateTheme = useCallback(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    const body = window.document.body;
    
    let newResolvedTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      newResolvedTheme = theme;
    }
    
    setResolvedTheme(newResolvedTheme);
    
    // Update DOM classes for complete theme coverage
    root.classList.remove('light', 'dark');
    root.classList.add(newResolvedTheme);
    
    body.classList.remove('light', 'dark');
    body.classList.add(newResolvedTheme);
    
    // Ensure proper data attributes for theme targeting
    root.setAttribute('data-theme', newResolvedTheme);
    body.setAttribute('data-theme', newResolvedTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newResolvedTheme === 'dark' ? '#111827' : '#ffffff');
    }

    // Update CSS custom properties for smooth transitions
    root.style.setProperty('--theme-transition-duration', '300ms');
    root.style.setProperty('--theme-transition-timing', 'ease-in-out');
    
    // Set theme-aware CSS variables
    if (newResolvedTheme === 'dark') {
      root.style.setProperty('--bg-primary', '#111827');
      root.style.setProperty('--bg-secondary', '#1f2937');
      root.style.setProperty('--bg-tertiary', '#374151');
      root.style.setProperty('--text-primary', '#f9fafb');
      root.style.setProperty('--text-secondary', '#e5e7eb');
      root.style.setProperty('--border-primary', '#4b5563');
      root.style.setProperty('--border-secondary', '#6b7280');
      
      // Set body background for consistent theming
      body.style.backgroundColor = '#111827';
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f9fafb');
      root.style.setProperty('--bg-tertiary', '#f3f4f6');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#374151');
      root.style.setProperty('--border-primary', '#d1d5db');
      root.style.setProperty('--border-secondary', '#e5e7eb');
      
      // Set body background for consistent theming
      body.style.backgroundColor = '#ffffff';
    }

    // Add transition to body for smooth background changes
    body.style.transition = 'background-color 300ms ease-in-out';

    // Dispatch custom event for components that need to react to theme changes
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: newResolvedTheme } 
    }));

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎨 Theme updated: ${theme} → ${newResolvedTheme}`);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Immediate localStorage update
    if (typeof window !== 'undefined') {
      localStorage.setItem('fluffyswap-theme', newTheme);
    }
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎨 Theme set: ${newTheme}`);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    if (theme === 'system') {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemIsDark ? 'light' : 'dark');
    } else {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  }, [theme, setTheme]);

  // Initial theme setup effect
  useEffect(() => {
    updateTheme();
  }, [updateTheme]);

  // System theme change listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        updateTheme();
      }
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log(`🌙 System theme changed: ${e.matches ? 'dark' : 'light'}`);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme, updateTheme]);

  // Theme change effect - triggers when theme state changes
  useEffect(() => {
    updateTheme();
  }, [theme, updateTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
    toggleTheme,
  };
};