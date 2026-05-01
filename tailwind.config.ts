import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fff9f0",
        foreground: "#1f2937",
        card: "#ffffff",
        muted: "#f3e8d5",
        primary: {
          DEFAULT: "#c2410c",
          foreground: "#fff7ed",
        },
        secondary: {
          DEFAULT: "#0f766e",
          foreground: "#f0fdfa",
        },
        accent: {
          DEFAULT: "#f59e0b",
          foreground: "#1f2937",
        },
        border: "#e7d7bc",
        input: "#efe1ca",
        ring: "#fb923c",
        destructive: "#dc2626",
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        soft: "0 18px 45px -28px rgba(120, 53, 15, 0.55)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at top left, rgba(251,191,36,0.28), transparent 35%), radial-gradient(circle at bottom right, rgba(14,116,144,0.12), transparent 28%)",
      },
    },
  },
  plugins: [],
};

export default config;
