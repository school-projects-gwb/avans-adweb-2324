/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'rgb(var(--color-bg) / <alpha-value>)',
        'accent': 'rgb(var(--color-accent) / <alpha-value>)',
        'border': 'rgb(var(--color-border) / <alpha-value>)',
        'light': 'rgb(var(--color-text-light) / <alpha-value>)',
        'dark': 'rgb(var(--color-text-dark) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}

