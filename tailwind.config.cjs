/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'light-text': '#ffffff',
        'dark-text': '#151515',
        'card-bg': '#dedede'
      },
      fontSize: {
        xxs: '.85rem' // 14px
      }
    }
  },
  plugins: []
}
