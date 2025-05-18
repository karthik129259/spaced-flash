// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Scan all files in the src directory
    "./*.{js,ts,jsx,tsx}",        // Scan all files in the root directory
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',  // Tailwind blue-600 as primary brand color
        secondary: '#4B5563', // Tailwind gray-600 for secondary elements
        // Enhanced color palette for white theme
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        white: {
          DEFAULT: '#ffffff',
          'pure': '#ffffff',
          'off': '#f9fafb',
          'warm': '#f8f7f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'soft': '0 4px 15px -3px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.02)',
        'soft-md': '0 6px 20px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -3px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 6px 12px -4px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'glow-sm': '0 2px 8px 0 rgba(59, 130, 246, 0.3)',
        'glow': '0 0 15px 2px rgba(59, 130, 246, 0.4)',
        'glow-md': '0 0 25px 5px rgba(59, 130, 246, 0.5), 0 0 10px 2px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 35px 10px rgba(59, 130, 246, 0.5), 0 0 20px 5px rgba(59, 130, 246, 0.3)',
        'glow-xl': '0 0 50px 15px rgba(59, 130, 246, 0.6), 0 0 30px 8px rgba(59, 130, 246, 0.4)',
        'nebula': '0 0 30px rgba(124, 58, 237, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
