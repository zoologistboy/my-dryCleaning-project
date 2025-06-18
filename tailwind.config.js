const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class', // You already had this correctly
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], // updated from 'purge'
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...fontFamily.sans],
      },
      colors: {
        primary: {
          400: '#00E0F3',
          500: '#00c4fd',
        },
        dark: '#333333',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
