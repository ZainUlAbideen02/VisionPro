import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        welcomeBlue: '#5B6CFF',
        welcomeGreen: '#00EB8D',
        welcomeYellow: '#F3FFAB',
        welcomeDark: '#000000',
        welcomeCard: 'rgba(255, 255, 255, 0.08)',
        welcomeBorder: 'rgba(255, 255, 255, 0.1)',
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#5B6CFF',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        cyanGlow: '#06b6d4',
        accentViolet: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee-up': 'marqueeUp 20s linear infinite',
        'marquee-down': 'marqueeDown 20s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite alternate',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marqueeUp: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        marqueeDown: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        pulseGlow: {
          '0%': { opacity: '0.4', transform: 'scale(1)' },
          '100%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
