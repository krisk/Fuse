const { readFile, writeFile, stat } = require('node:fs/promises')
const { join, sep, basename } = require('node:path')
const pckg = require('../package.json')
const typescript = require('typescript')
const chalk = require('chalk')

const VERSION = process.env.VERSION || pckg.version

async function injectTypes() {
  const banner = [
    `// Type definitions for Fuse.js v${VERSION}`,
    `// TypeScript v${typescript.version}`
  ].join('\n')

  const typingsTemplateFile = join(
    __dirname,
    '../src/typings/fuse.d.ts.template'
  )
  let typingsTemplate = await readFile(typingsTemplateFile, 'utf-8')

  const typingsCJSFile = join(__dirname, '../src/typings/fuse.d.cts.template')
  const distTypingsCJSFile = join(__dirname, '../dist/fuse.d.cts')
  let typingsCJS = await readFile(typingsCJSFile, 'utf-8')

  const typingsMJSFile = join(__dirname, '../src/typings/fuse.d.mts.template')
  const distTypingsMJSFile = join(__dirname, '../dist/fuse.d.mts')
  let typingsMJS = await readFile(typingsMJSFile, 'utf-8')

  const files = [
    [distTypingsCJSFile, typingsCJS],
    [distTypingsMJSFile, typingsMJS]
  ]

  for (const [outputFile, fileContent] of files) {
    const contentToInject = [
      //
      banner,
      typingsTemplate,
      fileContent
    ].join('\n')

    await writeFile(outputFile, contentToInject)

    const outputFileSize = bytesToKilobytes((await stat(outputFile)).size)

    console.log(
      `${chalk.bold.blue(`dist${sep}${basename(outputFile)}`)} ${outputFileSize}kb`
    )
  }
}

/**
 * @param {number} bytes
 */
function bytesToKilobytes(bytes) {
  return Math.round((bytes / 1024 + Number.EPSILON) * 100) / 100
}

module.exports = injectTypes
