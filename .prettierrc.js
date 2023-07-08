module.exports = {
  trailingComma: 'none',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  overrides: [
    {
      files: '*.svg',
      options: {
        parser: 'html'
      }
    }
  ]
}
