import { defineConfig } from 'astro/config'
import astroI18next from 'astro-i18next'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), astroI18next(), react()]
})
