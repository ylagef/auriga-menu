/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
  defaultLanguage: 'es',
  supportedLanguages: ['en', 'es'],
  i18next: {
    debug: false,
    initImmediate: false,
    backend: {
      loadPath: './src/locales/{{lng}}.json'
    }
  },
  i18nextPlugins: { fsBackend: 'i18next-fs-backend' }
}