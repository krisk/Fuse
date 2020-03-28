const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const terser = require('terser')
const rollup = require('rollup')
const configs = require('./configs')

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

build(Object.keys(configs).map((key) => configs[key]))

async function build(builds) {
  for (const entry of builds) {
    try {
      await buildEntry(entry)
    } catch (err) {
      logError(err)
    }
  }
}

async function buildEntry(config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /(min|prod)\.js$/.test(file)

  try {
    let bundle = await rollup.rollup(config)
    let {
      output: [{ code }]
    } = await bundle.generate(output)

    if (isProd) {
      const minified =
        (banner || '') +
        terser.minify(code, {
          toplevel: true,
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
      return write(file, minified, true)
    } else {
      return write(file, code)
    }
  } catch (err) {
    throw new Error(err)
  }
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(
        blue(path.relative(process.cwd(), dest)) +
          ' ' +
          getSize(code) +
          (extra || '')
      )
      resolve()
    }

    fs.writeFile(dest, code, (err) => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(` (gzipped: ${getSize(zipped)})`)
        })
      } else {
        report()
      }
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.error(e)
}

function blue(str) {
  return `\x1b[1m\x1b[34m${str}\x1b[39m\x1b[22m`
}
