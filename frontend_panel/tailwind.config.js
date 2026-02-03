/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bitcoin: "#F7931A",
        ethereum: "#627EEA",
        solana: "#00FFA3",
        cardano: "#0033AD",
        polkadot: "#E6007A",
        ripple: "#00A2FF",
        litecoin: "#BFBBBB",
        chainlink: "#2A5ADA",
        
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // Purple-blue primary color
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        accent: {
          50: "#F5F3FF",
          500: "#6366F1",
          600: "#4F46E5",
        },
      },
      screens: {
        // Mobile-first breakpoints
        xs: "475px", // Extra small devices
        sm: "640px", // Small devices
        md: "768px", // Medium devices
        lg: "1024px", // Large devices
        xl: "1280px", // Extra large devices
        "2xl": "1536px", // 2X large devices

        // Max-width breakpoints for specific adjustments
        "max-xs": { max: "474px" },
        "max-sm": { max: "639px" },
        "max-md": { max: "767px" },
        "max-lg": { max: "1023px" },
        "max-xl": { max: "1279px" },

        // Custom breakpoints from your original config
        "max-1200px": { max: "1200px" },
        "max-1045px": { max: "1045px" },
        "min-1045px": { min: "1045px" },
        "max-900px": { max: "900px" },
        "max-630px": { max: "630px" },
        "max-480px": { max: "480px" },
        "max-420px": { max: "420px" },
        "max-380px": { max: "380px" },
        "max-360px": { max: "360px" },
        "max-345px": { max: "345px" },
        "max-320px": { max: "320px" },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      fontSize: {
        xxs: "0.625rem", // 10px
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
      },
      transitionProperty: {
        width: "width",
        transform: "transform",
      },
      fontFamily: {
        display: ["PP Mori", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};
