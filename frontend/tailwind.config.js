const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/modal.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#155DFC",
        dark: "#030712",
        grayDark: "#101828",
        gray: "#545C6B",
      },
    },
  },
  plugins: [heroui()],
}

