const { path } = require('@vuepress/shared-utils')

module.exports = (options, context) => ({
  name: 'google-analytics',
  enhanceAppFiles: path.resolve(__dirname, 'enhanceApp.js')
})
