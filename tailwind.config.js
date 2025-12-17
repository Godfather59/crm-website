/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material 3 inspired tonal palettes, but with richer saturation
        primary: {
          10: '#1c0f3e',
          20: '#321c68',
          30: '#4a2c94',
          40: '#643dc2', // Key color
          80: '#c2a8fc',
          90: '#e5dff7',
        },
        secondary: {
          10: '#001f24',
          20: '#00363d',
          30: '#004f59',
          40: '#006a78',
          80: '#a3effc',
          90: '#dff7fc',
        },
        surface: {
          900: '#09090b', // Deep background
          800: '#18181b', // Card background
          700: '#27272a',
        }
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(39, 39, 42, 0.4) 0%, rgba(24, 24, 27, 0.1) 100%)',
        'gradient-primary': 'linear-gradient(today, #643dc2, #c2a8fc)',
        'gradient-glow': 'radial-gradient(circle at top left, rgba(100, 61, 194, 0.3) 0%, transparent 50%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'none': '0',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '20px',
      }
    },
  },
  plugins: [],
}
