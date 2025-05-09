/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        portalGul: "#FFF200",
        portalSvart: "#000000"
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif']
      }
    }
  },
  plugins: []
}
