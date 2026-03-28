import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'book-amber': '#D4A574',
        'book-brown': '#8B6F47',
        'book-dark': '#3E2723',
        'book-cream': '#FFF8F0',
        'book-gold': '#C9A876',
      },
    },
  },
  plugins: [],
}
export default config
