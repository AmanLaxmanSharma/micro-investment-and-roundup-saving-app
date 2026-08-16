/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fintech: {
          page: "#F5F7F2",       /* Warm green-tinted off-white */
          card: "#FFFFFF",       /* Main card background */
          dark: "#123B2A",       /* Primary dark surface - Deep forest green */
          dark2: "#1B4D38",      /* Secondary dark surface */
          primary: "#18A66A",    /* Primary brand green */
          mintBright: "#55CFA0", /* Bright mint accent */
          mintSoft: "#E3F5ED",   /* Soft mint background */
          textMain: "#15231D",   /* Main text */
          textSec: "#60736A",    /* Secondary text */
          textMuted: "#8A9A92",  /* Muted text */
          border: "#D7E2DC",     /* Borders */
          blue: "#4778D9",       /* Blue info accent */
          purple: "#7658C9",     /* Purple accent */
          warning: "#D69A35",    /* Warning / Gold */
          growth: "#159A63",     /* Growth / Positive */
        },
        brand: {
          50: "#F5F7F2",
          100: "#E3F5ED",
          200: "#C4EAD9",
          300: "#8ED9B9",
          400: "#55CFA0",
          500: "#18A66A",
          600: "#159A63",
          700: "#1B4D38",
          800: "#123B2A",
          900: "#0E2E21",
          950: "#081C14",
        },
        emerald: {
          50: "#F5F7F2",
          100: "#E3F5ED",
          200: "#C4EAD9",
          300: "#8ED9B9",
          400: "#55CFA0",
          500: "#18A66A",
          600: "#159A63",
          700: "#1B4D38",
          800: "#123B2A",
          900: "#0E2E21",
          950: "#081C14",
        },
        mint: {
          50: "#FAFCFB",
          100: "#E3F5ED",
          200: "#C4EAD9",
          300: "#8ED9B9",
          400: "#55CFA0",
          500: "#18A66A",
          600: "#123B2A",
        },
        dark: {
          950: "#F5F7F2",
          900: "#FFFFFF",
          850: "#F8FAF6",
          800: "#E3F5ED",
          700: "#D7E2DC",
          600: "#18A66A",
        }
      },
      boxShadow: {
        'glow-brand': '0 4px 20px -2px rgba(24, 166, 106, 0.15)',
        'glow-emerald': '0 4px 20px -2px rgba(85, 207, 160, 0.2)',
        'glow-mint': '0 4px 20px -2px rgba(227, 245, 237, 0.5)',
        'glass': '0 4px 20px 0 rgba(18, 59, 42, 0.06)',
        'card-light': '0 1px 3px 0 rgba(21, 35, 29, 0.05), 0 1px 2px 0 rgba(21, 35, 29, 0.02)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
