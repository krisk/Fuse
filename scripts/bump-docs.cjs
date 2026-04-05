//Load the library and specify options
const { execSync } = require('child_process')
const replace = require('replace-in-file')
const VERSION = process.env.VERSION || execSync('npm view fuse.js version').toString().trim()

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
