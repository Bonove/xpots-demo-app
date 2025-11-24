import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        xpots: {
          orange: '#ff6441',
          grey: '#e9eae8',
          antraciet: '#202624',
          black: '#000000',
          softgreen: '#edf0e1',
          green: '#9eae8a',
          darkgreen: '#64786e'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.06)',
        strong: '0 6px 24px rgba(0,0,0,0.18)'
      }
    }
  },
  plugins: []
};

export default config;

