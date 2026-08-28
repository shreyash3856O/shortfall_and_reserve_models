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
          bg: "#0B0D10",
          card: "#12151B",
          cardHover: "#181C24",
          panel: "#161A22",
          border: "#232834",
          borderLight: "#2E3544",
          textMain: "#E6EDF3",
          textMuted: "#8B949E",
          textDim: "#586069",
          accent: "#C8A96E",       // Muted Manganese Gold / Ochre
          accentHover: "#B3955A",
          riskHigh: "#D9534F",     // Desaturated Red
          riskMed: "#E09B3D",      // Desaturated Amber
          riskLow: "#4E9F6E",      // Desaturated Healthy Green
          zoneGreen: "#3D8C5A",
          zoneYellow: "#C4A238",
          zoneRed: "#B84343",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
        lg: "6px",
      },
    },
  },
  plugins: [],
}
