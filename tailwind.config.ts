import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium fashion-focused palette
        cream: {
          50: '#fdfcf8',
          100: '#faf7f0',
          200: '#f5efe0',
          300: '#ede3c8',
          400: '#e0d0a8',
          500: '#d4bc88',
        },
        charcoal: {
          50: '#f5f5f4',
          100: '#e8e7e5',
          200: '#d2d0cc',
          300: '#b0ada7',
          400: '#87837b',
          500: '#6b6760',
          600: '#5a5650',
          700: '#4a4740',
          800: '#3d3b35',
          900: '#2c2a25',
          950: '#1a1916',
        },
        slate: {
          blue: '#8FA3B1',
          light: '#B8C9D3',
          muted: '#6B7F8C',
        },
        brand: {
          primary: '#2c2a25',
          secondary: '#d4bc88',
          accent: '#8FA3B1',
          light: '#faf7f0',
          dark: '#1a1916',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'premium-gradient': 'linear-gradient(135deg, #2c2a25 0%, #4a4740 50%, #2c2a25 100%)',
        'cream-gradient': 'linear-gradient(180deg, #faf7f0 0%, #f5efe0 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'premium': '0 20px 60px -15px rgba(44, 42, 37, 0.3)',
        'card': '0 4px 24px rgba(44, 42, 37, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
