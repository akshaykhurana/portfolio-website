module.exports = {
  theme: {
    darkMode: 'false', // false or 'media' or 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    screens: {

      'mob': { 'min': '320px', 'max': '767px' },
      // => @media (min-width: 320px and max-width: 767px) { ... }

      'tab': { 'min': '768px', 'max': '1023px' },
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      'sm': { 'min': '1024px', 'max': '1279px' },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      'med': { 'min': '1280px', 'max': '1535px' },
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      'lg': { 'min': '1536px' },
      // => @media (min-width: 1536px) { ... }

    },
    fontSize: {
      '6xl': ['48px', '56px'],
      '5xl': ['36px', '44px'],
      '4xl': ['30px', '36px'],
      '3xl': ['27px', '32px'],
      '2xl': ['24px', '28px'],
      xl: ['21px', '28px'],
      lg: ['18px', '28px'],
      lg24: ['18px', '24px'],
      base20: ['15px', '20px'],
      base: ['15px', '24px'],
      sm: ['12px', '20px'],
      xs: ['9px', '16px'],
    },
    extend: {
      gap: {
        16: '16px',
        24: '24px',
        32: '32px',
      },
      colors: {
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
          1000: 'rgba(46, 46, 46, 0.3)',
        },
        blue: {
          100: '#ebf8ff',
          200: '#bee3f8',
          300: '#90cdf4',
          400: '#63b3ed',
          500: '#4299e1',
          600: '#3182ce',
          700: '#2b6cb0',
          800: '#2c5282',
          900: '#2a4365',
        },
        purple: {
          100: '#1D00B2',
          200: '#150080',
        },
        black: {
          100: 'rgba(79, 76, 89, 1)',
        },
      },
    },
  },
  plugins: [],
};