/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        green: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        red: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        crypto: {
          bitcoin: "#F7931A",
          ethereum: "#627EEA",
          ripple: "#00A2FF",
          litecoin: "#BFBBBB",
          cardano: "#0033AD",
          polkadot: "#E6007A",
          dogecoin: "#C2A633",
          chainlink: "#2A5ADA",
          stellar: "#000000",
          tether: "#26A17B",
        },
      },
      animation: {
        gradient: "gradient 8s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite",
        "bar-load": "bar-load 0.6s ease-out",
        "card-appear": "card-appear 0.5s ease-out",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "coin-spin": "coin-spin 2s linear infinite",
        "price-up": "price-up 0.3s ease-out",
        "price-down": "price-down 0.3s ease-out",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "bar-load": {
          from: {
            transform: "scaleY(0)",
            transformOrigin: "bottom",
          },
          to: {
            transform: "scaleY(1)",
            transformOrigin: "bottom",
          },
        },
        "card-appear": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "coin-spin": {
          from: { transform: "rotateY(0deg)" },
          to: { transform: "rotateY(360deg)" },
        },
        "price-up": {
          "0%": {
            backgroundColor: "transparent",
            transform: "scale(1)",
          },
          "50%": {
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            transform: "scale(1.05)",
          },
          "100%": {
            backgroundColor: "transparent",
            transform: "scale(1)",
          },
        },
        "price-down": {
          "0%": {
            backgroundColor: "transparent",
            transform: "scale(1)",
          },
          "50%": {
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            transform: "scale(1.05)",
          },
          "100%": {
            backgroundColor: "transparent",
            transform: "scale(1)",
          },
        },
      },
      screens: {
        "max-1200px": { max: "1200px" },
        "max-1045px": { max: "1045px" },
        "max-900px": { max: "900px" },
        "max-630px": { max: "630px" },
        "max-767px": { max: "767px" },
        "max-565px": { max: "565px" },
        "max-480px": { max: "480px" },
        "max-420px": { max: "420px" },
        "max-380px": { max: "380px" },
        "max-360px": { max: "360px" },
        "max-345px": { max: "345px" },
        lg: "1200px",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        all: "all",
        colors:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
        transform: "transform",
        opacity: "opacity",
        shadow: "box-shadow",
        size: "width, height",
      },
      transitionDuration: {
        2000: "2000ms",
        3000: "3000ms",
      },
      fontFamily: {
        display: ["PP Mori", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
      },
      perspective: {
        coin: "1000px",
      },
      transformStyle: {
        "3d": "preserve-3d",
      },
      backfaceVisibility: {
        visible: "visible",
        hidden: "hidden",
      },
    },
  },
  plugins: [],
};
