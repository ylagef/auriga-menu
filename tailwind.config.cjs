/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'light-text': '#ffffff',
        'dark-text': '#151515',
        'card-bg': '#dedede',
        'card-bg-dark': '#202020e6'
      },
      fontSize: {
        xxs: '.8rem'
      }
    }
  },
  plugins: []
}
