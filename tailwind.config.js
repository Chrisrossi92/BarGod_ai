/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  safelist: [
    'text-rhyme-0',
    'text-rhyme-1',
    'text-rhyme-2',
    'text-rhyme-3',
    'text-rhyme-4',
    'text-rhyme-5',
    'font-bold',
  ],
  theme: {
    extend: {
      backgroundSize: {
        '200': '200% 200%',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
      },
      colors: {
        'rhyme-0': '#f87171', // red-400
        'rhyme-1': '#facc15', // yellow-400
        'rhyme-2': '#4ade80', // green-400
        'rhyme-3': '#38bdf8', // sky-400
        'rhyme-4': '#a78bfa', // purple-400
        'rhyme-5': '#fb923c', // orange-400
      }
    },
  },
  plugins: [],
}









