/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F5EF",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#6B8E23",
          hover: "#5A7A1D",
          active: "#4C6819",
          light: "#E4EBD4",
          "tint-10": "#EEF2E3",
        },
        text: {
          DEFAULT: "#2F3A2F",
          secondary: "#5C6B5C",
          muted: "#8B968B",
        },
        border: {
          DEFAULT: "#E2DED2",
          strong: "#C9C2AE",
        },
        success: "#4C8A5E",
        warning: "#C88A2E",
        error: "#B3452C",
        overlay: "rgba(47, 58, 47, 0.55)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Poppins", "-apple-system", "sans-serif"],
      },
      spacing: {
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-5": "20px",
        "space-6": "24px",
        "space-8": "32px",
        "space-10": "40px",
        "space-12": "48px",
        "space-16": "64px",
        "space-20": "80px",
        "space-24": "96px",
      },
      borderRadius: {
        sm: "6px",     // inputs, chips, badges
        md: "10px",    // buttons
        lg: "16px",    // product cards
        xl: "24px",    // modals, drawers, banners
        full: "999px", // pills
      },
      boxShadow: {
        sm: "0 1px 2px rgba(47,58,47,0.06)",
        md: "0 4px 12px rgba(47,58,47,0.08)",
        lg: "0 8px 24px rgba(47,58,47,0.12)",
        xl: "0 16px 40px rgba(47,58,47,0.18)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
      transitionTimingFunction: {
        default: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
}
