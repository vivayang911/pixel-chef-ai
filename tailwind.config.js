/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0d0b1f',
          soft: '#15122b',
          panel: '#1d1838',
          line: '#2c2550',
        },
        tomato: '#ff5277',
        cheese: '#ffcb3b',
        mint: '#5be7a9',
        sky: '#4cc9f0',
        grape: '#b388ff',
        cream: '#fdf6e3',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        terminal: ['"VT323"', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Hard, offset shadows that mimic 8-bit / pixel borders
        'pixel-sm': '4px 4px 0 0 rgba(0,0,0,0.85)',
        pixel: '6px 6px 0 0 rgba(0,0,0,0.85)',
        'pixel-lg': '10px 10px 0 0 rgba(0,0,0,0.85)',
        'pixel-inset': 'inset 4px 4px 0 0 rgba(0,0,0,0.35)',
        'glow-tomato': '0 0 0 2px #ff5277, 6px 6px 0 0 rgba(255,82,119,0.35)',
        'glow-cheese': '0 0 0 2px #ffcb3b, 6px 6px 0 0 rgba(255,203,59,0.35)',
      },
      backgroundImage: {
        'grid-pixel':
          'linear-gradient(rgba(179,136,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(179,136,255,0.08) 1px, transparent 1px)',
        'scanlines':
          'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
      },
      backgroundSize: {
        'grid-pixel': '32px 32px',
      },
      keyframes: {
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0.25' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.25)', opacity: '0' },
          '100%': { transform: 'scale(1.25)', opacity: '0' },
        },
        'hue-shift': {
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(25deg)' },
        },
      },
      animation: {
        'float-y': 'float-y 4s ease-in-out infinite',
        'blink': 'blink 1.1s step-end infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'hue-shift': 'hue-shift 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
