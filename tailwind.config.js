/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // GRADA Brand — Krujens Light Fresh
        fresh: {
          DEFAULT: '#FAFBFD',
          base: '#F0F4F8',
          surface: '#FFFFFF',
          surfaceAlt: '#F5F7FA',
        },
        ink: {
          DEFAULT: '#0A1530',
          muted: 'rgba(10, 21, 48, 0.55)',
          dim: 'rgba(10, 21, 48, 0.35)',
          faint: 'rgba(10, 21, 48, 0.10)',
        },
        mint: {
          DEFAULT: '#10B981',
          light: '#34D399',
          sky: '#5DC3FF',
          soft: '#D1FAE5',
          faint: 'rgba(16, 185, 129, 0.10)',
        },
        brand: {
          text: '#0A1530',
          border: 'rgba(10, 21, 48, 0.10)',
          muted: 'rgba(10, 21, 48, 0.55)',
          dim: 'rgba(10, 21, 48, 0.35)',
        },
      },
      boxShadow: {
        'glow-mint': '0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.2)',
        'glow-mint-sm': '0 0 10px rgba(16, 185, 129, 0.4)',
        'glow-sky': '0 0 20px rgba(93, 195, 255, 0.4)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Space Grotesk"', 'sans-serif'],
        ui: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        narrative: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'ken-burns': 'ken-burns 12s ease-out forwards',
        'glow-breathe': 'glow-breathe 3s ease-in-out infinite',
        'twinkle': 'twinkle 2.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'screen-in': 'screen-in 280ms ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1.08) translate(0,0)' },
          '100%': { transform: 'scale(1.18) translate(-2%, -1%)' },
        },
        'glow-breathe': {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px #10B981) drop-shadow(0 0 16px #10B981)' },
          '50%': { filter: 'drop-shadow(0 0 14px #10B981) drop-shadow(0 0 28px #10B981)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'screen-in': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
