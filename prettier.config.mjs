/** @type {import("prettier").Config} */
export default {
  endOfLine: 'auto',
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: ['.*', '*.md', '*.toml', '*.yml'],
      options: {
        useTabs: false,
      },
    },
    {
      files: ['**/*.astro'],
      options: {
        parser: 'astro',
      },
    },
  ],
};
