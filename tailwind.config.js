export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Hind Siliguri"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Noto Serif Bengali"', "ui-serif", "Georgia", "serif"],
      },
      colors: {
        ink: {
          950: "#0d1220",
          900: "#131a2b",
          800: "#1c2540",
          700: "#2c3756",
          600: "#475170",
          500: "#6b7494",
        },
      },
    },
  },
  plugins: [],
};
