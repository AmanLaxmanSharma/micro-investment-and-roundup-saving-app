/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fintech: {
          page: "#F5F7FA",       /* Clean off-white background */
          card: "#FFFFFF",       /* Card and component background */
          navy: "#123B5D",       /* Primary brand Deep Navy Blue */
          dark: "#123B5D",       /* Deep Navy Blue surface */
          dark2: "#0D2A42",      /* Darker navy secondary surface */
          navyLight: "#1E5380",  /* Lighter navy highlight */
          primary: "#123B5D",    /* Primary brand color */
          growth: "#16A36A",     /* Secondary / Growth color Green */
          secondary: "#16A36A",  /* Secondary action color */
          mintBright: "#16A36A", /* Positive / CTA green */
          mintSoft: "#DCFCE7",   /* Light green background for success states */
          textMain: "#1F2937",   /* Primary text */
          textSec: "#64748B",    /* Secondary text */
          textMuted: "#94A3B8",  /* Muted text */
          border: "#E2E8F0",     /* Border color */
          positive: "#16A36A",   /* Positive financial indicator */
          negative: "#DC2626",   /* Negative financial indicator */
          danger: "#DC2626",     /* Danger / Negative */
          blue: "#3B82F6",       /* Blue info accent */
          purple: "#8B5CF6",     /* Purple accent */
          warning: "#D97706",    /* Warning / Gold */
        },
        navy: {
          50: "#F0F6FA",
          100: "#E1EDF5",
          200: "#B8D4E7",
          300: "#85B5D5",
          400: "#4F8FBD",
          500: "#123B5D",
          600: "#0F3250",
          700: "#0D2A42",
          800: "#091F31",
          900: "#061521",
          950: "#030B12",
        },
        brand: {
          50: "#F5F7FA",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#16A36A",
          600: "#138959",
          700: "#1E5380",
          800: "#123B5D",
          900: "#0D2A42",
          950: "#081C2E",
        },
        emerald: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#16A36A",
          600: "#138959",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
          950: "#052E16",
        },
        mint: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#16A36A",
          600: "#123B5D",
        },
        dark: {
          950: "#081C2E",
          900: "#0D2A42",
          850: "#123B5D",
          800: "#1E5380",
          700: "#E2E8F0",
          600: "#16A36A",
        }
      },
      boxShadow: {
        'glow-brand': '0 4px 20px -2px rgba(18, 59, 93, 0.15)',
        'glow-emerald': '0 4px 20px -2px rgba(22, 163, 106, 0.2)',
        'glow-growth': '0 4px 20px -2px rgba(22, 163, 106, 0.25)',
        'glow-mint': '0 4px 20px -2px rgba(220, 252, 231, 0.6)',
        'glass': '0 4px 20px 0 rgba(18, 59, 93, 0.06)',
        'card-light': '0 1px 3px 0 rgba(31, 41, 55, 0.05), 0 1px 2px 0 rgba(31, 41, 55, 0.03)',
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
