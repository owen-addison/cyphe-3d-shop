/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#f7faf2',
          100: '#C7C9C3',
          200: '#DBDDD6',
          300: '#dbddd6',
          400: '#C5C6C0',
          500: '#AFB0AB',
          600: '#999A95',
          700: '#838480',
          800: '#6D6E6B',
          900: '#575855',
          950: '#414240',
        },
      },
      fontFamily: {
        sans: [
          '"M PLUS 1"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      letterSpacing: {
        'wider-2': '0.2em',
        'wider-3': '0.3em',
      },
    },
  },
  plugins: [],
};
