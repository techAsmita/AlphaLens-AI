import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#090909",
        card: "#111111",
        primary: "#00F59B",
        secondary: "#5CF2FF",
        danger: "#FF4D6D",
        text: "#F7F7F7",
        muted: "#8A8A8A",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        container: "1280px",
      },
      keyframes: {
        "grid-drift": {
          "0%": { backgroundPosition: "0px 0px" },
          "100%": { backgroundPosition: "64px 64px" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-10%)", opacity: "0" },
          "10%": { opacity: "0.5" },
          "90%": { opacity: "0.5" },
          "100%": { transform: "translateY(110vh)", opacity: "0" },
        },
        "glow-drift": {
          "0%, 100%": { transform: "translate(-50%, 0) scale(1)" },
          "50%": { transform: "translate(-46%, 2%) scale(1.05)" },
        },
        "noise-flicker": {
          "0%, 100%": { opacity: "0.025" },
          "50%": { opacity: "0.04" },
        },
        "ticker-scroll": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "grid-drift": "grid-drift 60s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "scan-line": "scan-line 8s linear infinite",
        "glow-drift": "glow-drift 20s ease-in-out infinite",
        "noise-flicker": "noise-flicker 6s ease-in-out infinite",
        "ticker-scroll": "ticker-scroll 40s linear infinite",
        "pulse-dot": "pulse-dot 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
