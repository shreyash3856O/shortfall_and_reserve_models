/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midas: {
          bg: "#111111",
          card: "#1E1E1E",
          cardHover: "#252525",
          panel: "#191919",
          border: "#2E2E2E",
          borderLight: "#3C3C3C",
          textMain: "#EFEFEF",
          textMuted: "#9A9A9A",
          textDim: "#606060",
          accent: "#C0BDB8",       // Warm Silver-Stone
          accentDim: "#8A8680",
          riskHigh: "#D94F4F",     // Muted Crimson
          riskMed: "#C98040",      // Muted Amber
          riskLow: "#4F9067",      // Muted Sage Green
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
      },
    },
  },
  plugins: [],
}
