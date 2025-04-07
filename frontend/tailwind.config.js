import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        glow: "glow 1.5s infinite alternate ease-in-out",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(10, 102, 194, 0.5)" },
          "50%": { boxShadow: "0 0 25px rgba(10, 102, 194, 1)" },
          "100%": { boxShadow: "0 0 10px rgba(10, 102, 194, 0.5)" },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            p: { marginBottom: "1rem" },
            ol: { paddingLeft: "1.5rem", listStyleType: "decimal" },
            ul: { paddingLeft: "1.5rem", listStyleType: "disc" },
            '[style*="text-align:center"]': { textAlign: "center" },
          },
        },
      }),
    },
  },
  plugins: [daisyui, typography],
  daisyui: {
    themes: [
      {
        linkedin: {
          primary: "#0A66C2",
          secondary: "#FFFFFF",
          accent: "#7FC15E",
          neutral: "#000000",
          "base-100": "#F3F2EF",
          info: "#5E5E5E",
          success: "#057642",
          warning: "#F5C75D",
          error: "#CC1016",
        },
      },
    ],
  },
};
