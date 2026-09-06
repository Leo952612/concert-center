/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0f5',
          100: '#d9d9e6',
          200: '#b3b3cc',
          300: '#8c8cb3',
          400: '#666699',
          500: '#404080',
          600: '#1A1A2E',
          700: '#141425',
          800: '#0d0d1a',
          900: '#07070d',
        },
        secondary: {
          500: '#E94560',
        },
        gold: {
          500: '#F5A623',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}