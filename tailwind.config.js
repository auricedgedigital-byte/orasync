/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./components/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./styles/**/*.{css}",
    "./app/dashboard/**/*.{js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        // fallback tokens in case old template used custom values
        background: "#ffffff",   // maps bg-background → white
        border: "#e5e7eb",      // maps border-border → gray-200
        primary: "#4f46e5",     // maps bg-primary → indigo-600
        default: "#111827",     // maps text-default → gray-900
      },
    },
  },
  plugins: [],
};
