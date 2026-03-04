import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#fdf8f0",
          100: "#f9eedd",
          200: "#f0dfc4",
          300: "#e2c9a0",
          400: "#c9a872",
        },
        forest: {
          500: "#4a7c59",
          600: "#3d6649",
          700: "#2f4f37",
        },
        sunset: {
          400: "#e8915a",
          500: "#d97a3e",
          600: "#c2682f",
        },
        lake: {
          400: "#5b9ead",
          500: "#4a8a99",
          600: "#3b7381",
        },
      },
    },
  },
  plugins: [],
};
export default config;
