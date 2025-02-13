import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    fontFamily: {
      serif: ["serif"],
      sans: ["Chivo Mono", "sans-serif"],
      mono: ["Chivo Mono", "mono"],
    },
    extend: {
      willChange: {
        "top": "top",
      },
    },
  },
} satisfies Config;
