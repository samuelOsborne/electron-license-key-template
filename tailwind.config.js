/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,css,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["dark"]
  },
  plugins: [require("daisyui")],
}
