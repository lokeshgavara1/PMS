/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#b3c9de',
          300: '#8ca5cf',
          400: '#6885c0',
          500: '#2c3e50', // Main navy
          600: '#1a2332',
          700: '#0f1419',
          800: '#08090c',
          900: '#040506',
        },
        'teal': {
          50: '#ecf7f8',
          100: '#d0ecef',
          200: '#a1dfe6',
          300: '#6ecdd8',
          400: '#4abcc9',
          500: '#4a8a96', // Main teal
          600: '#3a6b78',
          700: '#2a525f',
          800: '#1a3946',
          900: '#0a202d',
        },
        'sky-blue': {
          50: '#f0f7fb',
          100: '#d6edf5',
          200: '#acdaed',
          300: '#7ec1e0',
          400: '#5ab0d8',
          500: '#5ba6d8', // Main sky blue
          600: '#4a8fc4',
          700: '#3a73ad',
          800: '#2a5a96',
          900: '#1a417f',
        },
        'beige': {
          50: '#faf8f4',
          100: '#f3f0e8',
          200: '#e8e3d8',
          300: '#dcd4c4',
          400: '#d0cbb8', // Light beige
          500: '#c9c0b0', // Main beige
          600: '#b5a896',
          700: '#a1907c',
          800: '#8d7862',
          900: '#796f56',
        },
      },
      backgroundColor: {
        'primary': '#2c3e50', // Navy
        'secondary': '#4a8a96', // Teal
        'accent': '#5ba6d8', // Sky Blue
        'light': '#f3f0e8', // Beige
      },
      textColor: {
        'primary': '#2c3e50', // Navy
        'secondary': '#4a8a96', // Teal
      },
      borderColor: {
        'primary': '#2c3e50', // Navy
        'secondary': '#4a8a96', // Teal
      },
    },
  },
  plugins: [],
}
