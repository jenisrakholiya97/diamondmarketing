/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#171717',
        ivory: '#FAF9F6',
        champagne: {
          50: '#FAF7F2',
          100: '#F1EDE5',
          200: '#E4DAC6',
          300: '#DED5C4',
          400: '#D4B87C',
          500: '#C6A15B', // Primary Champagne Gold Accent
          600: '#B38D4D', // Champagne Gold Hover
          700: '#916F38',
          800: '#70542B',
          900: '#523C1E',
        },
        gold: {
          50: '#FAF7F2',
          100: '#F1EDE5',
          200: '#E4DAC6',
          300: '#DED5C4',
          400: '#D4B87C',
          500: '#C6A15B',
          600: '#B38D4D',
          700: '#916F38',
          800: '#70542B',
          900: '#523C1E',
        },
        emerald: {
          50: '#FAF9F6',
          100: '#F1EDE5',
          200: '#DED5C4',
          300: '#C6A15B',
          400: '#C6A15B',
          500: '#C6A15B', // Champagne Gold
          600: '#171717', // Deep Charcoal Primary
          700: '#B38D4D',
          800: '#111111',
          900: '#171717',
          950: '#111111',
        },
        charcoal: '#171717',
        beige: '#F1EDE5',
        stone: {
          gray: '#77736C',
        },
        sage: {
          light: '#DDE5DF',
          dark: '#31443A',
        },
        luxury: {
          black: '#111111',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
