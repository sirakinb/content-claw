/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c',
        surface: {
          50: '#141416',
          100: '#1a1a1c',
          200: '#232326',
        },
        primary: {
          DEFAULT: '#8b5cf6', // purple-500
          hover: '#7c3aed', // purple-600
          light: '#a78bfa', // purple-400
          transparent: 'rgba(139, 92, 246, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glow-strong': '0 0 30px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
