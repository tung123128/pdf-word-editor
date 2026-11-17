import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef2f2",
          100: "#fde4df",
          200: "#fcc7c3",
          300: "#f89a94",
          400: "#f2645c",
          500: "#e5322d", // iLovePDF Brand Primary Red
          600: "#d92323",
          700: "#bd060a", // Brand hover
          800: "#990b0e",
          900: "#7f1012",
          950: "#450406",
        },
        dark: {
          bg: "#0f1015",          // Nền chính tối
          card: "#171821",        // Bề mặt thẻ card
          elevated: "#1f202e",    // Bề mặt nổi (dropdown, modal)
          border: "#2c2e42",      // Viền dark
          borderHover: "#4a4d6b", // Viền dark hover
          text: "#f5f5fa",        // Chữ chính dark
          muted: "#a6a9be",       // Chữ phụ dark
          subtle: "#72758e",      // Chú thích mờ dark
        },
        ilove: {
          red: "#e5322d",
          blue: "#008ee9",
          green: "#4acd86",
          orange: "#ffc233",
          purple: "#7253e2",
          gray: "#707078",
          darkText: "#161616",
          cardBorder: "#d6d6df",
          cardHover: "#292931",
          pageBg: "#f5f5fa",
        },
      },
      boxShadow: {
        'paper': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06), 0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'paper-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'glow-red': '0 0 25px -5px rgba(229, 50, 45, 0.35)',
        'glow-red-lg': '0 0 35px -5px rgba(229, 50, 45, 0.5)',
        'glow-blue': '0 0 25px -5px rgba(0, 142, 233, 0.35)',
        'card-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.12), 0 0 15px -3px rgba(0, 0, 0, 0.06)',
        'card-dark-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px -3px rgba(229, 50, 45, 0.15)',
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
