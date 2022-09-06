module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:astro/recommended', 'standard', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      rules: {
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error',
        camelcase: 'warn',
        indent: [
          'error',
          2,
          {
            SwitchCase: 1
          }
        ],
        'no-tabs': 0
      }
    }
  ]
}
