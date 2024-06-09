/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#f0f0f0',
        customGreen: '#cce1e4',
        customWhite: '#f4f8f9'
      },
    },
  },
  plugins: [],
}

