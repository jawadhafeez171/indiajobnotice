import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1E3799",       // Exact Royal Navy from INDIA NOTICE in logo
          navyDark: "#10205C",   // Deep Navy for text & dark footer
          navyMuted: "#152A77",  // Medium dark navy
          navyLight: "#EEF2FA",  // Soft Navy wash for pills & tables
          navyBorder: "#CCD8F0", // Navy container border
          orange: "#E96B15",     // Exact Saffron Orange from JOB in logo
          orangeDark: "#D4590A", // Hover state for Saffron
          orangeLight: "#FDF3EB",// Soft Saffron wash for urgency & alerts
          orangeBorder: "#F9D9C3",
          green: "#209948",      // Exact Tiranga Green from logo capsule
          greenDark: "#177B37",
          greenLight: "#EDF7F0", // Soft Green wash for verified & admit cards
          greenBorder: "#C6E7D0",
          canvas: "#FCFAF4",     // Exact warm ivory background from logo
          card: "#FFFFFF",
          border: "#EAE2D2",     // Sandstone border
          text: "#1A1918",
          muted: "#68635B",
        },
      },
    },
  },
  plugins: [],
};

export default config;
