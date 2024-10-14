/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        pixel: ['VT323'],
        pixelify: ['"Pixelify Sans"', 'sans-serif'],
        pacifico: ['Pacifico'],
        londrina: ['"Londrina Outline"', 'cursive'],
        barlow: ['"Barlow"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}