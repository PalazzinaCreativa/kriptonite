module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      yellow: '#FFCC67',
      white: '#FFFFFF',
      black: '#2B3036',
      gray: '#E0E0E0'
    },
    transitionTimingFunction: {
      'ease-in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      'ease-in': 'cubic-bezier(0.4, 0, 1, 0.65)',
      'ease-out': 'cubic-bezier(0.218, 0.58, 0.36, 1)',
      'power-out': 'cubic-bezier(0.82, 0, 0.36, 1)',
      bounce: 'cubic-bezier(.17,.67,.3,1.33)'
    },
    fontSize: {
      xs: ['0.875rem', '1.28'],
      s: ['1rem', '1.28'],
      m: ['1.375rem', '1.28'],
      l: ['1.875rem', '1.28'],
      xl: ['2.5rem', '1.28']
    },
    fontWeight: {
      light: 300,
      regular: 400,
      'semi-bold': 600
    },
    transitionDuration: {
      400: '400ms',
      600: '600ms',
      800: '800ms',
      1200: '1200ms',
      1400: '1400ms',
      1600: '1600ms',
      1800: '1800ms',
      2000: '2000ms',
      2200: '2200ms'
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}