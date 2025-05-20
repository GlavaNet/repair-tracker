/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        dark: {
          primary: '#1a202c',
          secondary: '#2d3748',
          tertiary: '#4a5568',
        }
      },
      textColor: {
        dark: {
          primary: '#f7fafc',
          secondary: '#e2e8f0',
          tertiary: '#a0aec0',
        }
      }
    },
  },
  plugins: [],
}