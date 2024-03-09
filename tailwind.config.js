/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      primari: "#1C2E46",
      secondari: "#FFFFFF",
      green: "#00B876",
      red: "#EF4C53",
      black: "#000000",
    },
    fontFamily: {
      primari: ['"Roboto"', "sans-serif"],
      secondari: ["Open Sans", "sans-serif"],
    },
  },
  plugins: [require("daisyui")],
};
