import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#0a1628",       // Deep Financial Blue (darkest)
          navy: "#0f2140",       // Navy blue (sections)
          blue: "#1a3a5c",       // Medium blue (cards)
          mint: "#2dd4bf",       // Vibrant Mint Green (accents / CTA)
          "mint-light": "#5eead4", // Lighter mint for hover
          glow: "rgba(45,212,191,0.5)", // Mint glow
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0a1628 0%, #0f2140 40%, #134e4a 100%)",
        "gradient-mint": "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 50%, #0d9488 100%)",
        "gradient-blue-mint": "linear-gradient(90deg, #1e3a5f 0%, #2dd4bf 100%)",
      },
      boxShadow: {
        "neon-mint": "0 0 15px rgba(45,212,191,0.5), 0 0 45px rgba(45,212,191,0.2)",
        "neon-blue": "0 0 15px rgba(59,130,246,0.5), 0 0 45px rgba(59,130,246,0.2)",
        "glass": "0 8px 32px rgba(0,0,0,0.3)",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(45,212,191,0.4)" },
          "50%": { boxShadow: "0 0 30px rgba(45,212,191,0.7), 0 0 60px rgba(45,212,191,0.3)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
