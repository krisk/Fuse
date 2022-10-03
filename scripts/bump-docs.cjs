//Load the library and specify options
const replace = require('replace-in-file')
const pckg = require('../package.json')
const VERSION = process.env.VERSION || pckg.version

const options = {
  files: './docs/getting-started/installation.md',
  from: /(\d+\.)(\d+\.)(\d+)/g,
  to: VERSION
}

async function bump() {
  try {
    const results = await replace(options)
    console.log('Replacement results:', results)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

bump()
