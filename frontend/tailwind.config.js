/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fafaf8',
          100: '#f5f5f0',
          200: '#eeede6',
          300: '#e4e3d9',
        },
        brand: {
          purple: '#7c6ff7',
          'purple-light': '#a89ff9',
          'purple-dark': '#5b52d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px 0 rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
