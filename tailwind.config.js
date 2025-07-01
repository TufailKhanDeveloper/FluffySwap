/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // Disable dark mode completely
  theme: {
    extend: {
      colors: {
        // Custom kawaii color palette
        kawaii: {
          pink: '#FFD1DC',
          mint: '#B5EAD7',
          lavender: '#C7CEEA',
          'soft-pink': '#F8BBD9',
          'light-purple': '#E4C1F9',
        },
        // Light theme colors using CSS custom properties
        primary: {
          bg: 'var(--bg-primary)',
          text: 'var(--text-primary)',
          border: 'var(--border-primary)',
        },
        secondary: {
          bg: 'var(--bg-secondary)',
          text: 'var(--text-secondary)',
          border: 'var(--border-secondary)',
        },
        tertiary: {
          bg: 'var(--bg-tertiary)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(236, 72, 153, 0.3)',
        'glow-lg': '0 0 40px rgba(236, 72, 153, 0.4)',
        'light': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};