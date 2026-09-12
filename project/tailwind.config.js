/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1A1A2E',
          soft: '#3A3A52',
          muted: '#6B6B80',
        },
        canvas: {
          DEFAULT: '#F5F6FA',
          card: '#FFFFFF',
          tint: '#E7EDF6',
        },
        indigo: {
          50: '#EEF0FA',
          100: '#D9DDF3',
          200: '#B0B8E4',
          300: '#7F8BCF',
          400: '#3F4FA8',
          500: '#0A0E3F',
          600: '#07092E',
          700: '#050725',
          800: '#04051D',
          900: '#030416',
        },
        coral: {
          50: '#F1F6FB',
          100: '#E0EAF5',
          200: '#C1D4EA',
          300: '#9CBADE',
          400: '#6792C4',
          500: '#4A7AB5',
          600: '#3E6899',
          700: '#30517A',
          800: '#223A57',
          900: '#142333',
        },
        line: '#E4E8F0',
        green: {
          50: '#ECF7F0',
          100: '#D4ECDD',
          200: '#A8D8BB',
          300: '#7CC499',
          400: '#50B077',
          500: '#2F8F5B',
          600: '#257049',
          700: '#1B5238',
          800: '#123426',
          900: '#0A1B14',
        },
        success: '#2F8F5B',
        warning: '#E0A526',
        error: '#C0392B',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      maxWidth: {
        page: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};