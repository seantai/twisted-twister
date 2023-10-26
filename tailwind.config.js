/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fira: ["FiraGO", "sans-serif"],
      },
    },
  },
  plugins: [require("prettier-plugin-tailwindcss")],
};
