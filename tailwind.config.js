/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        accent: "#10B981",
        danger: "#EF4444",
        surface: "#1E293B",
        "surface-light": "#F8FAFC",
      },
    },
  },
  plugins: [],
};
