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
        brand: {
          blue: '#5B6CFF',       // Primary CTA Accent (Buttons, Highlights)
          neon: '#00EB8D',       // Attendance / Success Green Badge
          lime: '#F3FFAB',       // Accent Highlight Yellow
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#5B6CFF',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        surface: {
          black: '#000000',      // Pure Black Base Background
          card: 'rgba(255, 255, 255, 0.08)', // Frosted glass cards
          border: 'rgba(255, 255, 255, 0.1)',  // Subtle borders
          dark: '#000000',
          hover: 'rgba(255, 255, 255, 0.12)',
        },
        welcomeBlue: '#5B6CFF',
        welcomeGreen: '#00EB8D',
        welcomeYellow: '#F3FFAB',
        welcomeDark: '#000000',
        welcomeCard: 'rgba(255, 255, 255, 0.08)',
        welcomeBorder: 'rgba(255, 255, 255, 0.1)',
        cyanGlow: '#06b6d4',
        accentViolet: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'pill': '64px',          // Pill-shaped CTA buttons & search input
        'card': '16px',          // Video container & keyframe cards
      },
      boxShadow: {
        'inset-glow': 'inset 1px 1px 1px rgba(255, 255, 255, 0.25)',
        'hero-mockup': '-33px 38px 80px -1px rgba(0, 0, 0, 0.6)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.4)',
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
