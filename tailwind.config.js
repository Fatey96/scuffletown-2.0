/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e31c25', // Red color theme
          dark: '#b51219',
          light: '#ff3c45',
          50: '#fee2e2',
          100: '#fecaca',
          200: '#fca5a5',
          300: '#f87171',
          400: '#ef4444',
          500: '#e31c25',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#6d1a1a',
          950: '#450a0a',
        },
        secondary: {
          DEFAULT: '#1a1a2e', // Darker blue-black for contrast
          light: '#2d2d44',
          dark: '#0f0f1a',
          50: '#f0f1f5',
          100: '#dadce4',
          200: '#b4b7c9',
          300: '#8f93ae',
          400: '#6a6e93',
          500: '#4d5175',
          600: '#3d415e',
          700: '#2d3047',
          800: '#1a1a2e',
          900: '#0f0f1a',
          950: '#090911',
        },
        accent: {
          DEFAULT: '#f0f0f0', // Light grey for backgrounds
          dark: '#d1d1d1',
          100: '#f9fafb',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.85)', // Card backgrounds with opacity for glassmorphism
          dark: 'rgba(26, 26, 46, 0.85)', // Dark mode card with opacity
          border: 'rgba(226, 232, 240, 0.5)',
        },
        text: {
          DEFAULT: '#1e293b', // Main text color
          light: '#64748b', // For secondary text
          dark: '#0f172a',  // For important text
          white: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/hero-background.jpg')",
      },
      boxShadow: {
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 