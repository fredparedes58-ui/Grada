/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Electric Citrus Premium — warm obsidian base
        obsidian: {
          DEFAULT: '#0F0D0A',
          deep: '#0F0D0A',
          base: '#141009',
          surface: '#1A1612',
          surfaceAlt: '#241F18',
        },
        citrus: {
          DEFAULT: '#CCFF00',
          lime: '#CCFF00',
          amber: '#FFB800',
          coral: '#FF5B3A',
        },
        warm: {
          text: '#FAF5EB',
          border: 'rgba(255, 220, 180, 0.08)',
          muted: 'rgba(250, 245, 235, 0.6)',
          dim: 'rgba(250, 245, 235, 0.4)',
        },
      },
      boxShadow: {
        'glow-lime': '0 0 20px rgba(204, 255, 0, 0.5), 0 0 40px rgba(204, 255, 0, 0.2)',
        'glow-lime-sm': '0 0 10px rgba(204, 255, 0, 0.4)',
        'glow-amber': '0 0 20px rgba(255, 184, 0, 0.5), 0 0 40px rgba(255, 184, 0, 0.2)',
        'glow-coral': '0 0 20px rgba(255, 91, 58, 0.5), 0 0 40px rgba(255, 91, 58, 0.2)',
      },
      fontFamily: {
        condensed: ['"Archivo"', '"Barlow Condensed"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
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
          '0%, 100%': { filter: 'drop-shadow(0 0 8px #CCFF00) drop-shadow(0 0 16px #CCFF00)' },
          '50%': { filter: 'drop-shadow(0 0 14px #CCFF00) drop-shadow(0 0 28px #CCFF00)' },
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
