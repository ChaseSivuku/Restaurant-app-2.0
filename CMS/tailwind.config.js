/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#CD7112',
          dark: '#A85A0E',
          light: '#E88A3A',
        },
      },
    },
  },
  plugins: [],
}

