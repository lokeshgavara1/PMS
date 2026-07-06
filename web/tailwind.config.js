/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#2c3e50',
        teal: '#4a8a96',
        'sky-blue': '#5ba6d8',
        beige: '#c9c0b0',
        'navy-light': '#f0f4f8',
        'teal-light': '#ecf7f8',
        'sky-blue-light': '#f0f7fb',
        'beige-light': '#faf8f4',
        'navy-dark': '#1a2332',
        'teal-dark': '#3a6b78',
      },
    },
  },
  plugins: [],
}
