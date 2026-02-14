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
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#6366f1", // Indigo/Pro
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#1e293b", // Slate-800
                    foreground: "#f8fafc",
                },
                accent: {
                    DEFAULT: "#F59E0B", // Gold
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#334155",
                    foreground: "#94a3b8",
                },
                success: "#10b981",
                warning: "#f59e0b",
                error: "#ef4444",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                heading: ["var(--font-space-grotesk)", "sans-serif"],
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                float: "float 6s ease-in-out infinite",
                "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                aurora: "aurora 20s linear infinite",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "pulse-glow": {
                    "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" },
                    "50%": { opacity: "0.5", boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)" },
                },
                aurora: {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "aurora-gradient": "linear-gradient(-45deg, #0f172a, #1e1b4b, #312e81, #4338ca)",
            },
        },
    },
    plugins: [],
};
export default config;
