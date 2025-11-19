/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Mobile-optimized spacing
      spacing: {
        "safe-area-inset-bottom": "env(safe-area-inset-bottom)",
        "safe-area-inset-top": "env(safe-area-inset-top)",
      },
      // Mobile-friendly screen sizes
      screens: {
        xs: "475px",
        touch: { raw: "(hover: none) and (pointer: coarse)" },
      },
      colors: {
        // Purple Pastel Theme
        primary: {
          50: "#faf7ff",
          100: "#f2ebff",
          200: "#e8ddff",
          300: "#d5c2ff",
          400: "#bb99ff",
          500: "#a066ff",
          600: "#8a3ffc",
          700: "#7c2cdf",
          800: "#6b25b8",
          900: "#5a2196",
        },
        secondary: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      animation: {
        breathe: "breathe 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        blink: "blink 0.5s infinite alternate",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        blink: {
          "0%": {
            color: "#00ff00",
            textShadow: "0 0 10px #00ff00, 0 0 20px #00ff00",
          },
          "50%": {
            color: "#ff0000",
            textShadow: "0 0 10px #ff0000, 0 0 20px #ff0000",
          },
          "100%": {
            color: "#00ff00",
            textShadow: "0 0 10px #00ff00, 0 0 20px #00ff00",
          },
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar")({ nocompatible: true }), // 👈 thêm dòng này
  ],
};