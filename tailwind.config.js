/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./articles/**/*.md"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kvant: '#8b5cf6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
