import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-space)', 'monospace'],
        mono:    ['var(--font-mono)',  'monospace'],
      },
      colors: {
        accent:  { DEFAULT: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
        violet:  { DEFAULT: '#8b5cf6', light: '#a78bfa' },
        emerald: { DEFAULT: '#10b981', light: '#34d399' },
        dark: {
          DEFAULT: '#050508',
          100: '#0c0c12',
          200: '#12121a',
          300: '#1a1a26',
          400: '#24243a',
        },
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'pulse-slow':'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-16px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
