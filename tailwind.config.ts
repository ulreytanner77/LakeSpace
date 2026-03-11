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
          50: "#F6F8F7",
          100: "#EEF2F0",
          200: "#E0E6E3",
          300: "#B0BDB6",
          400: "#8A9B92",
        },
        forest: {
          500: "#2F6F57",
          600: "#266049",
          700: "#1D4F3B",
          800: "#153F2E",
        },
        sunset: {
          400: "#FFD47A",
          500: "#FFC857",
          600: "#E6B34E",
          700: "#CC9E45",
        },
        lake: {
          400: "#6BB4DA",
          500: "#4FA3D1",
          600: "#3A8AB5",
          700: "#2D7199",
          800: "#215A7D",
        },
      },
    },
  },
  plugins: [],
};
export default config;
