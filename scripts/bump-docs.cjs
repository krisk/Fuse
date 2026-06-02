//Load the library and specify options
const replace = require('replace-in-file')
// Use the version in package.json (the one being released) rather than the
// latest published version from `npm view` -- otherwise running this before
// `npm publish` (as the release flow does) bumps the docs to the previous
// version and lags one release behind.
const VERSION = process.env.VERSION || require('../package.json').version

const options = {
  files: './docs/getting-started.md',
  from: /(\d+\.)(\d+\.)(\d+)(-[a-zA-Z0-9.]+)?/g,
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
