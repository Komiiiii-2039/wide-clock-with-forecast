
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'classic-cyan': '#00FFFF',
        'classic-cyan-bg': '#111111',
        'retro-green': '#00FF00',
        'retro-green-bg': '#222222',
        'modern-amber': '#FFBF00',
        'modern-amber-bg': '#191933',
      },
      fontFamily: {
        dseg7: ['DSEG7', 'sans-serif'],
        vt323: ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
