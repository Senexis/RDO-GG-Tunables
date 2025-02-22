import formsPlugin from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./*.html', './src/**/*.{vue,js,ts,jsx,tsx,html}'],
  theme: {
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',

      black: '#000',
      white: '#fff',

      primary: {
        50: 'rgb(var(--color-primary-50) / <alpha-value>)',
        100: 'rgb(var(--color-primary-100) / <alpha-value>)',
        200: 'rgb(var(--color-primary-200) / <alpha-value>)',
        300: 'rgb(var(--color-primary-300) / <alpha-value>)',
        400: 'rgb(var(--color-primary-400) / <alpha-value>)',
        500: 'rgb(var(--color-primary-500) / <alpha-value>)',
        600: 'rgb(var(--color-primary-600) / <alpha-value>)',
        700: 'rgb(var(--color-primary-700) / <alpha-value>)',
        800: 'rgb(var(--color-primary-800) / <alpha-value>)',
        900: 'rgb(var(--color-primary-900) / <alpha-value>)',
      },
      secondary: {
        50: 'rgb(var(--color-secondary-50) / <alpha-value>)',
        100: 'rgb(var(--color-secondary-100) / <alpha-value>)',
        200: 'rgb(var(--color-secondary-200) / <alpha-value>)',
        300: 'rgb(var(--color-secondary-300) / <alpha-value>)',
        400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
        500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
        600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
        700: 'rgb(var(--color-secondary-700) / <alpha-value>)',
        800: 'rgb(var(--color-secondary-800) / <alpha-value>)',
        900: 'rgb(var(--color-secondary-900) / <alpha-value>)',
      },
      danger: {
        50: 'rgb(var(--color-danger-50) / <alpha-value>)',
        100: 'rgb(var(--color-danger-100) / <alpha-value>)',
        200: 'rgb(var(--color-danger-200) / <alpha-value>)',
        300: 'rgb(var(--color-danger-300) / <alpha-value>)',
        400: 'rgb(var(--color-danger-400) / <alpha-value>)',
        500: 'rgb(var(--color-danger-500) / <alpha-value>)',
        600: 'rgb(var(--color-danger-600) / <alpha-value>)',
        700: 'rgb(var(--color-danger-700) / <alpha-value>)',
        800: 'rgb(var(--color-danger-800) / <alpha-value>)',
        900: 'rgb(var(--color-danger-900) / <alpha-value>)',
      },
    },
  },
  plugins: [formsPlugin],
};
