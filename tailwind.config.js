/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fira: ["FiraGO", "sans-serif"],
        // organical: ["Organical", "sans-serif"],
        super: ["Super Dessert", "sans-serif"],
      },
    },
  },
  plugins: [require("prettier-plugin-tailwindcss")],
};
