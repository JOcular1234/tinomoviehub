/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode using the `dark` class
  content: [
    './src/**/*.{js,jsx,ts,tsx}','./public/index.html' // Adjust based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#22C55E',
      },
    },
  },
  plugins: [],
};