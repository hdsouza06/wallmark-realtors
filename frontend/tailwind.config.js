/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1E3F",
          50: "#eef2f8",
          100: "#d3dcec",
          800: "#0f2750",
          900: "#0B1E3F",
          950: "#06122a",
        },
        gold: {
          DEFAULT: "#C8A96A",
          light: "#dcc6a0",
          50: "#faf6ee",
          100: "#f1e7d2",
          400: "#d4bd8a",
          500: "#C8A96A",
          600: "#b08f4d",
        },
        cream: "#F8F6F1",
        lightgrey: "#F3F4F6",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 20px 50px -20px rgba(11, 30, 63, 0.35)",
        gold: "0 10px 30px -10px rgba(200, 169, 106, 0.5)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to bottom, rgba(11,30,63,0.25), rgba(11,30,63,0.85))",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};
