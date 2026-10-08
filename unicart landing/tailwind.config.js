/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Poppins', '-apple-system', 'sans-serif'],
      },
      colors: {
        cream: '#F8F5EF',
        olive: {
          DEFAULT: '#5B2333',
          hover: '#481B27',
          active: '#37131D',
          light: '#F3E8EA',
        },
        ink: {
          DEFAULT: '#2D2224',
          muted: '#635356',
        },
      },
    },
  },
  plugins: [],
}
