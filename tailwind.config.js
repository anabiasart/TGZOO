/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lilas: {
          400: "#c084fc", // lilás claro
          500: "#a855f7", // lilás médio
          600: "#9333ea", // lilás escuro
        },
      },
    },
  },
  plugins: [],
}
