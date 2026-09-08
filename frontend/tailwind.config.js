/** @type {import('tailwindcss').Config} */
// Tailwind scans these application files and generates only the utility classes they use.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        'glow-sm': '0 0 20px rgba(139,92,246,0.2)',
        'glow-md': '0 0 40px rgba(139,92,246,0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
