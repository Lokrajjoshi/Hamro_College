/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Inspired by the Nepali flag: crimson + deep blue
        brand: { 50: "#fdf2f4", 100: "#fce4e8", 500: "#e0334f", 600: "#c8102e", 700: "#a50d26" },
        navy: { 50: "#eef3fb", 100: "#d9e3f5", 700: "#003893", 800: "#12306e", 900: "#0b1f4d" },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Noto Sans Devanagari", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
