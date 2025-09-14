/** @type {import('tailwindcss').Config} */
export default {
  // This line must be correct
  darkMode: ['class', '[data-theme="dark"]'], 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}