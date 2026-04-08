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
        'fab-pink': '#EFA8EE',
        'fab-dark': '#222222',
        'fab-purple': '#5040AE',
        'fab-crimson': '#8D2424',
        'fab-cream': '#FAF9F5',
        'fab-purple-light': '#6B5CE7',
        'fab-pink-light': '#F5C6F5',
        'fab-pink-deep': '#D580D4',
      },
    },
  },
  plugins: [],
}
export default config
