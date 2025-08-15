/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gaming-green': '#00ff88',
        'gaming-blue': '#0066ff',
        'gaming-purple': '#8b5cf6',
        'dark-bg': '#0a0a0a',
        'dark-card': '#1a1a1a',
        'dark-border': '#333333',
      },
      animation: {
        'pulse-gaming': 'pulse-gaming 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gaming': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.05)', opacity: '1' },
        },
        'glow': {
          '0%': { 'box-shadow': '0 0 20px rgba(0, 255, 136, 0.3)' },
          '100%': { 'box-shadow': '0 0 30px rgba(0, 255, 136, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      fontFamily: {
        'gaming': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};