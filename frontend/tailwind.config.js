/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#14181c', // Letterboxd dark blue/grey
        panel: '#2c3440',
        primary: '#00e054', // Letterboxd green
        muted: '#8b9bab',
      }
    },
  },
  plugins: [],
}
