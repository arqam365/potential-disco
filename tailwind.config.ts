import type { Config } from "tailwindcss";

import colors from 'tailwindcss/colors';

const config: Config = {

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    darkMode: false,
    extend: {
      colors: {
        'warm-gray': colors.stone,
        sky: colors.sky,
        cyan: colors.cyan,
      },

      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
      },
      animation: {
        bounce: 'bounce 1s infinite',
      },
      fontFamily: {
        zasque: ['Zasque', 'sans-serif'],
      },


      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require('preline/plugin'), require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
export default config;
