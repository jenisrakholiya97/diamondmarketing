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
        accent: {
          50: 'var(--color-accent-50, #FAF7F2)',
          100: 'var(--color-accent-100, #F4ECE0)',
          200: 'var(--color-accent-200, #E7D7B4)',
          300: 'var(--color-accent-300, #D8BF8C)',
          400: 'var(--color-accent-400, #D4B87C)',
          DEFAULT: 'var(--color-accent, #C8A96B)',
          500: 'var(--color-accent, #C8A96B)',
          600: 'var(--color-accent-hover, #9E7B43)',
          700: 'var(--color-accent-700, #8C6832)',
          800: 'var(--color-accent-800, #6B4D22)',
          900: 'var(--color-accent-900, #4A3414)',
          light: 'var(--color-accent-light, #E7D7B4)',
          dark: 'var(--color-accent-dark, #8C6832)',
          subtle: 'var(--color-accent-subtle, rgba(200, 169, 107, 0.15))',
          glow: 'var(--color-accent-glow, rgba(200, 169, 107, 0.25))',
        },
        champagne: {
          50: '#FAF7F2',
          100: '#F4ECE0',
          200: '#E7D7B4',
          300: '#D8BF8C',
          400: '#D4B87C',
          500: '#C8A96B', // Primary Champagne Gold Accent
          600: '#B59453', // Champagne Gold Hover
          700: '#8C6832', // Deep Gold Shade
          800: '#6B4D22', // Dark Gold Tone
          900: '#4A3414', // Extra Dark Gold Shade
        },
        gold: {
          50: '#FAF7F2',
          100: '#F4ECE0',
          200: '#E7D7B4',
          300: '#D8BF8C',
          400: '#D4B87C',
          500: '#C6A15B',
          600: '#B38D4D',
          700: '#916F38',
          800: '#70542B',
          900: '#523C1E',
        },
        emerald: {
          50: '#FAF9F6',
          100: '#F4ECE0',
          200: '#E7D7B4',
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
