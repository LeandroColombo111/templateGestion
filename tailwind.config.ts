import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          950: "#0b0f1a",
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155"
        },
        mint: {
          500: "#2dd4bf",
          400: "#5eead4"
        },
        amber: {
          500: "#f59e0b"
        },
        rose: {
          500: "#f43f5e"
        }
      }
    }
  },
  plugins: []
};

export default config;
