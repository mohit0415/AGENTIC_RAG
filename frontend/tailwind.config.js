/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          cyan: "#00C9FF",
          teal: "#00C9A7",
          bg: "#0D1B2A",
          sidebar: "#0A1520",
          border: "#1B2D40",
          bubble: "#122033",
          "bubble-user": "#0F2535",
          "border-user": "#1B4060",
          muted: "#4A6070",
          mid: "#5A8099",
          "text-sec": "#C8D8E8",
          "text-pri": "#F0F4F8",
        },
      },
      animation: {
        "bounce-slow": "bounce 1.2s infinite",
      },
    },
  },
  plugins: [],
};
