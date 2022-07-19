module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        flickering: 'flickering 0.25s infinite',
        'rotation-on-axis': 'rotation-on-axis 3s infinite ease-in-out',
        button: 'button 0.2s cubic-bezier(.75,.1,.22,.99)'
      },
      keyframes: {
        button: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '49%': { transform: 'translateY(-30px)', opacity: '1' },
          '50%': { transform: 'translateY(-30px)', opacity: '0' },
          '51%': { transform: 'translateY(30px)', opacity: '0' },
          '52%': { transform: 'translateY(30px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        flickering: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.66' },
          '75%': { opacity: '0.75' }
        },
        'rotation-on-axis': {
          '0%': {
            transform: 'perspective(120px) rotateX(0deg) rotateY(0deg)'
          },
          '25%': {
            transform: 'perspective(120px) rotateX(-180deg) rotateY(0deg)'
          },
          '50%': {
            transform: 'perspective(120px) rotateX(-360deg) rotateY(0deg)'
          },
          '75%': {
            transform: 'perspective(120px) rotateX(-360deg) rotateY(-180deg)'
          },
          '100%': {
            transform: 'perspective(120px) rotateX(-360deg) rotateY(-360deg)'
          }
        }
      },
      fontSize: {
        xxs: ['0.75rem', '1.28'],
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
      zIndex: {
        '1' : '1',
        '2' : '2',
        '3' : '3',
        '4' : '4',
        '5' : '5',
        '6' : '6'
      }
    },
    colors: {
      yellow: '#FFCC67',
      white: '#FFFFFF',
      black: '#2B3036',
      'light-gray': '#F6F6F6',
      gray: '#E0E0E0',
      cyan: '#4AB2FD',
      'dark-gray': '#AEAEAE',
      'red': '#E14040',
      current: 'currentColor'
    },
    transitionTimingFunction: {
      'ease-in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      'ease-in': 'cubic-bezier(0.4, 0, 1, 0.65)',
      'ease-out': 'cubic-bezier(0.218, 0.58, 0.36, 1)',
      'power-out': 'cubic-bezier(0.82, 0, 0.36, 1)',
      bounce: 'cubic-bezier(.17,.67,.3,1.33)'
    },
    transitionDuration: {
      300: '300ms',
      400: '400ms',
      600: '600ms',
      800: '800ms',
      1200: '1200ms',
      1400: '1400ms',
      1600: '1600ms',
      1800: '1800ms',
      2000: '2000ms',
      2200: '2200ms'
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}