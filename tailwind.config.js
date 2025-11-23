// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    // ¡ESTA LÍNEA ES LA IMPORTANTE! Asegúrate de que cubra dónde está tu Carpetas.tsx
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}