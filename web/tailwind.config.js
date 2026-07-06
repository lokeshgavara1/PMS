/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#2c3e50',
          light: '#f0f4f8',
          dark: '#1a2332',
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#2c3e50',
          700: '#0f1419',
        },
        teal: {
          DEFAULT: '#4a8a96',
          light: '#ecf7f8',
          dark: '#3a6b78',
          50: '#ecf7f8',
          100: '#d0ecef',
          500: '#4a8a96',
          700: '#2a525f',
        },
        'sky-blue': {
          DEFAULT: '#5ba6d8',
          light: '#f0f7fb',
          50: '#f0f7fb',
          100: '#d6edf5',
          500: '#5ba6d8',
        },
        beige: {
          DEFAULT: '#c9c0b0',
          light: '#faf8f4',
          50: '#faf8f4',
          100: '#f3f0e8',
          500: '#c9c0b0',
        },
      },
    },
  },
  plugins: [],
}
