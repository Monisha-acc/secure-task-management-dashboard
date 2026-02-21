/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          card: '#1e2235',
          border: '#3a3d4a',
        },
        accent: {
          DEFAULT: '#6c63ff',
          hover: '#5a52e0',
          soft: '#6c63ff1a',
        },
        status: {
          todo: '#94a3b8',
          'in-progress': '#f59e0b',
          done: '#10b981',
        },
        priority: {
          low: '#60a5fa',
          medium: '#f59e0b',
          high: '#f87171',
        },
      },
    },
  },
  plugins: [],
};

