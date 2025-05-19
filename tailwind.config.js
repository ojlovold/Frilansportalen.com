/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        portalGul: "#FFEF77", // eller din eksakte gultone
      },
    },
  },
  safelist: [
    {
      pattern: /(bg|text)-(portalGul|black|white|gray-(100|200|300)|yellow-(100|200|300))/,
    },
  ],
  plugins: [],
};
