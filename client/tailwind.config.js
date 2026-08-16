/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tnred: '#EF4444',
        tngreen: '#10B981',
        tnyellow: '#F59E0B',
      }
    },
  },
  plugins: [],
}
