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
          // Midnight Luxe palette
          obsidian: "#0D0D12",      // Primary background (darkest)
          slate: "#2A2A35",         // Section backgrounds / cards
          champagne: "#C9A84C",     // Accent — CTAs, highlights
          "champagne-light": "#E2C97E", // Lighter champagne for hover
          ivory: "#FAF8F5",         // Light text / surfaces
          "champagne-glow": "rgba(201,168,76,0.45)", // Glow effects
          // Keep legacy names aliased for existing component compatibility
          deep: "#0D0D12",
          navy: "#1A1A22",
          blue: "#2A2A35",
          mint: "#C9A84C",
          "mint-light": "#E2C97E",
          glow: "rgba(201,168,76,0.45)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
        drama: ['"Playfair Display"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "Menlo", "monospace"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0D0D12 0%, #1A1A22 40%, #2A2A35 100%)",
        "gradient-champagne": "linear-gradient(135deg, #C9A84C 0%, #A8853A 50%, #8B6B28 100%)",
        "gradient-luxe": "linear-gradient(90deg, #1A1A22 0%, #C9A84C 100%)",
      },
      boxShadow: {
        "neon-champagne": "0 0 15px rgba(201,168,76,0.5), 0 0 45px rgba(201,168,76,0.2)",
        "neon-gold": "0 0 20px rgba(201,168,76,0.4), 0 0 60px rgba(201,168,76,0.15)",
        "glass": "0 8px 32px rgba(0,0,0,0.5)",
        // keep old name for existing components
        "neon-mint": "0 0 15px rgba(201,168,76,0.5), 0 0 45px rgba(201,168,76,0.2)",
        "neon-blue": "0 0 15px rgba(201,168,76,0.3), 0 0 45px rgba(201,168,76,0.1)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      animation: {
        "aurora": "aurora 60s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "shimmer": "shimmer 3s linear infinite",
        "typewriter-cursor": "typewriter-cursor 1s step-end infinite",
        "scanner": "scanner 2.5s linear infinite",
        "waveform": "waveform 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "aurora": {
          "from": { backgroundPosition: "50% 50%, 50% 50%" },
          "to": { backgroundPosition: "350% 50%, 350% 50%" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(201,168,76,0.35)" },
          "50%": { boxShadow: "0 0 35px rgba(201,168,76,0.7), 0 0 70px rgba(201,168,76,0.3)" },
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
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "typewriter-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "scanner": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
        "waveform": {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-120" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
