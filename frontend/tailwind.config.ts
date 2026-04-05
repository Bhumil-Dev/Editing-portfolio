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
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-space)', 'monospace'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        cyan: { DEFAULT: '#00F5FF', dark: '#00B8C4' },
        purple: { DEFAULT: '#7B2FBE', light: '#9D4EDD', 400: '#9D4EDD', dark: '#5A1F8A' },
        neon: { DEFAULT: '#00FF88', blue: '#2563EB' },
        dark: {
          DEFAULT: '#030712',
          100: '#0a0f1e',
          200: '#0f172a',
          300: '#1e293b',
          400: '#334155',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0,245,255,0.3)' },
          '100%': { boxShadow: '0 0 50px rgba(0,245,255,0.8)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
