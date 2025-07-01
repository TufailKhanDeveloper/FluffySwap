import { useState, useEffect, useCallback } from 'react';

/**
 * Simplified Theme Hook - Light Mode Only
 * 
 * This hook provides a consistent light theme experience without
 * the complexity of dark mode transitions that were causing issues.
 */
export const useTheme = () => {
  // Always return light theme values
  const theme = 'light';
  const resolvedTheme = 'light';
  const isDark = false;

  // Initialize light theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Ensure light theme classes
    root.classList.remove('dark');
    root.classList.add('light');
    
    body.classList.remove('dark');
    body.classList.add('light');
    
    // Set light theme attributes
    root.setAttribute('data-theme', 'light');
    body.setAttribute('data-theme', 'light');
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#ffffff');
    }

    // Set light theme CSS variables
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f9fafb');
    root.style.setProperty('--bg-tertiary', '#f3f4f6');
    root.style.setProperty('--text-primary', '#111827');
    root.style.setProperty('--text-secondary', '#374151');
    root.style.setProperty('--border-primary', '#d1d5db');
    root.style.setProperty('--border-secondary', '#e5e7eb');
    
    // Set body background
    body.style.backgroundColor = '#ffffff';
    body.style.transition = 'none'; // Remove transitions
  }, []);

  // Dummy functions for compatibility
  const setTheme = useCallback(() => {
    // No-op since we only support light mode
  }, []);

  const toggleTheme = useCallback(() => {
    // No-op since we only support light mode
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark,
    toggleTheme,
  };
};