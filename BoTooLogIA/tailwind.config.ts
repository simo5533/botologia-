import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        reveal: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        /* Fonds du thème (variables CSS) */
        theme: {
          page: "rgb(var(--bg-page))",
          section: "rgb(var(--bg-section))",
          card: "rgb(var(--bg-card))",
        },
        /* Palette futuriste / cyber */
        neon: {
          cyan: "#00f5ff",
          blue: "#0066ff",
          purple: "#bf00ff",
          pink: "#ff00aa",
          green: "#00ff88",
          orange: "#ff6600",
        },
        cyber: {
          cyan: "#00d4ff",
          blue: "#0ea5e9",
          purple: "#a855f7",
          slate: "#0f172a",
          "slate-light": "#1e293b",
        },
        future: {
          "glass-border": "rgba(0, 245, 255, 0.15)",
          "glass-bg": "rgba(255, 255, 255, 0.06)",
          "glass-bg-dark": "rgba(0, 15, 30, 0.6)",
        },
        holographic: {
          cyan: "#00d4ff",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          glow: "rgba(0, 212, 255, 0.4)",
        },
        guiding: {
          dark: "#0a0a0a",
          blue: "#7dd3fc",
          "blue-bright": "#38bdf8",
          "blue-glow": "#0ea5e9",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.18)",
        },
        reveal: {
          cream: "#e6e0d8",
          "cream-soft": "rgb(230 224 216 / 0.5)",
          dark: "#0a0a0a",
        },
        agentic: {
          cyan: "#00E5FF",
          "cyan-dim": "rgba(0, 229, 255, 0.6)",
          violet: "#8b5cf6",
          graphite: "#0c121c",
          surface: "rgba(15, 20, 35, 0.9)",
          glass: "rgba(255, 255, 255, 0.06)",
          "glass-border": "rgba(0, 229, 255, 0.15)",
        },
        luna: {
          1: "#A7EBF2",
          2: "#54ACBF",
          3: "#26658C",
          4: "#023859",
          5: "#011C40",
        },
        dimension: {
          glow: "rgb(var(--dimension-glow))",
          "glow-muted": "rgba(0, 212, 255, 0.6)",
          portal: "rgb(var(--portal-energy))",
          steel: "rgb(var(--robotic-steel))",
          "shadow-deep": "rgb(var(--cyber-shadow-deep))",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.2)",
        "glow-lg": "0 0 40px rgba(0, 212, 255, 0.4), 0 0 80px rgba(0, 212, 255, 0.2)",
        hologram: "inset 0 0 60px rgba(0, 212, 255, 0.05), 0 0 30px rgba(0, 212, 255, 0.1)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "teleport-out": {
          "0%": { opacity: "1", transform: "scale(1)", filter: "blur(0px)" },
          "50%": { opacity: "1", transform: "scale(1.02)", filter: "blur(2px)" },
          "100%": { opacity: "0", transform: "scale(1.5)", filter: "blur(12px)" },
        },
        "teleport-in": {
          "0%": { opacity: "0", transform: "scale(0.8)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "scale(1)", filter: "blur(0px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "dimension-glow-pulse": {
          "0%, 100%": { opacity: "0.7", boxShadow: "0 0 20px rgba(0, 212, 255, 0.25)" },
          "50%": { opacity: "1", boxShadow: "0 0 40px rgba(0, 212, 255, 0.4)" },
        },
        "portal-energy-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.5" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
          "100%": { transform: "scale(0.95)", opacity: "0.5" },
        },
        "light-sweep": {
          "0%": { transform: "translateX(-100%) skewX(-12deg)" },
          "100%": { transform: "translateX(200%) skewX(-12deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { textShadow: "0 0 10px #06b6d4" },
          "50%": { textShadow: "0 0 25px #22d3ee" },
        },
        loading: {
          "0%": { width: "0%", marginLeft: "0%" },
          "50%": { width: "70%", marginLeft: "15%" },
          "100%": { width: "0%", marginLeft: "100%" },
        },
        glitch: {
          "0%, 100%": { clipPath: "inset(0 0 95% 0)" },
          "25%": { clipPath: "inset(40% 0 40% 0)" },
          "50%": { clipPath: "inset(70% 0 10% 0)" },
          "75%": { clipPath: "inset(20% 0 60% 0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0,200,255,0.3)" },
          "50%": {
            boxShadow:
              "0 0 20px rgba(0,200,255,0.8), 0 0 40px rgba(0,200,255,0.3)",
          },
        },
        "grid-move": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.6s ease forwards",
        "scanline": "scanline 8s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "teleport-out": "teleport-out 0.5s ease-in forwards",
        "teleport-in": "teleport-in 0.4s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "dimension-glow-pulse": "dimension-glow-pulse 2.5s ease-in-out infinite",
        "portal-energy-ring": "portal-energy-ring 3s ease-in-out infinite",
        "light-sweep": "light-sweep 2s ease-in-out",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "loading-bar": "loading 1.5s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        glitch: "glitch 0.15s steps(2) infinite",
        "grid-move": "grid-move 3s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "holographic-gradient":
          "linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(59,130,246,0.05) 50%, rgba(139,92,246,0.1) 100%)",
        "reveal-harmony":
          "linear-gradient(135deg, rgba(230,224,216,0.15) 0%, rgba(0,212,255,0.06) 50%, rgba(230,224,216,0.08) 100%)",
        "agentic-bg":
          "linear-gradient(165deg, #011C40 0%, #023859 25%, #26658C 55%, #023859 85%, #011C40 100%)",
        "agentic-glow":
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 229, 255, 0.15) 0%, rgba(84, 172, 191, 0.06) 40%, transparent 70%)",
        "dimension-portal-gradient":
          "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0, 212, 255, 0.12) 0%, rgba(125, 211, 252, 0.04) 40%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
