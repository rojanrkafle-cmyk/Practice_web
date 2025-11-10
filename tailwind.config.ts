import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'crimson-red': '#DC143C',
        'dark-red': '#8B0000',
        'deep-black': '#0A0A0A',
        'charcoal': '#1A1A1A',
        'gold': '#FFD700',
        'dark-gold': '#D4AF37',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        japanese: ['Noto Sans JP', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

