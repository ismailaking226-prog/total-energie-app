import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#0f8f4a',
          dark: '#113b2d',
          gold: '#f6c453',
          orange: '#f59f2c',
          blue: '#1d4ed8'
        }
      },
      boxShadow: {
        soft: '0 18px 40px rgba(17, 59, 45, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
