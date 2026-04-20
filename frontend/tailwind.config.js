/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        void: "#050811",
        "void-2": "#090e1c",
        steel: "#0e1629",
        "steel-2": "#141f38",
        mist: "#1d2b47",
        line: "#253655",
        "line-soft": "#1a2742",
        ink: "#cfe3ff",
        "ink-dim": "#8fa5c8",
        "ink-ghost": "#5a6d8f",
        cyan: "#5ee0f0",
        "cyan-deep": "#2aa8c0",
        violet: "#8b7ff5",
        "violet-deep": "#6356c9",
        gold: "#d4b86a",
        "gold-dim": "#8a7640",
        crimson: "#e0597a",
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        sans: ["Rajdhani", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
