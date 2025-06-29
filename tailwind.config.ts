/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#FDFDFD',
          100: '#F6F7F5',
          200: '#F2F2F0',
          300: '#E9EAE5',
          400: '#DBDDD6',
          500: '#A7AC9B',
          600: '#8D937D',
          700: '#717763',
          800: '#55594A',
          900: '#393B31',
          950: '#1C1E19',
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
        mohave: ['Mohave', 'sans-serif'],
        maven: ['Maven Pro', 'sans-serif'],
        cardo: ['Cardo', 'serif'],
      },
      letterSpacing: {
        'wider-1': '0.1em',
        'wider-2': '0.2em',
        'wider-3': '0.3em',
      },
    },
  },
  plugins: [],
};
