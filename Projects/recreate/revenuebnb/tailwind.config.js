/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        GTBold: ['GTBold', 'sans-serif'],
        GTBoldOblique: ['GTBoldOblique', 'sans-serif'],
        GTMedium: ['GTMedium', 'sans-serif'],
        GTLight: ['GTLight', 'sans-serif'],
        GTRegular: ['GTRegular', 'sans-serif'],
        GTMediumOblique: ['GTMediumOblique', 'sans-serif'],
        GTEestiTextLight: ['GT Eesti Text Light', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
