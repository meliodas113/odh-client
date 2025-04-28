import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        footerBg: "#0A1A2F",
        "palette-text": "#A3BFFA",
        "palette-link": "#60A5FA",
        "palette-hover": "#E0F2FE",
        "title-accent": "#3B82F6",
        "title-light": "#F3F4F6",
        "tab-active-bg": "#1E3A8A",
        "tab-inactive-bg": "#0F172A",
        "tab-active-text": "#E0F2FE",
        "tab-inactive-text": "#A3BFFA",
        "badge-active-bg": "#1E40AF", // Active badge background
        "badge-active-border": "#3B82F6", // Active badge border
        "badge-active-text": "#E0F2FE", // Active badge text
        "badge-ended-bg": "#334155", // Ended badge background
        "badge-ended-border": "#64748B", // Ended badge border
        "badge-ended-text": "#A3BFFA",
        "card-bg": "#0D1B2A",
        "card-border": "#374151",
        "progress-foreground": "#3B82F6", // Progress bar fill
        "progress-background": "#1E293B",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
