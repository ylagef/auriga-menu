module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  // ...
  extends: [
    // ...
    'standard',
    'plugin:astro/recommended'
  ],
  // ...
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
        'no-undef': 'warn',
        'no-unused-vars': 'warn',
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
    // ...
  ]
}
