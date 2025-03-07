/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        yugi: {
          gold: '#D4AF37',
          purple: '#4A148C',
          darkblue: '#1A237E',
        },
      },
    },
  },
  plugins: [],
}
