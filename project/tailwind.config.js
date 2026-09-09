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
          DEFAULT: '#F3F8FC',
          card: '#FFFFFF',
          tint: '#E3EFFA',
        },
        indigo: {
          50: '#EFEFFB',
          100: '#D8D6F5',
          200: '#B1ADEB',
          300: '#817CDF',
          400: '#524BD3',
          500: '#221D6B',
          600: '#1C1857',
          700: '#181452',
          800: '#120F3D',
          900: '#0F0D35',
        },
        coral: {
          50: '#EEF6FB',
          100: '#D5E7F6',
          200: '#ACD0EC',
          300: '#79B4E1',
          400: '#4A94D2',
          500: '#2979B8',
          600: '#216396',
          700: '#1A4D75',
          800: '#133753',
          900: '#0C2436',
        },
        line: '#E6E4EF',
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
