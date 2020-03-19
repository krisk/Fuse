import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import pckg from './package.json'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import copy from 'rollup-plugin-copy'
import path from 'path'
import fs from 'fs'

const VERSION = pckg.version
const AUTHOR = pckg.author
const HOMEPAGE = pckg.homepage

const copyright = fs.readFileSync(path.resolve(__dirname, './COPYRIGHT.txt'), 'UTF8')
const banner = '/* ' + copyright
  .replace('{VERSION}', `v${VERSION}`)
  .replace('{AUTHOR_URL}', `${AUTHOR.url}`)
  .replace('{HOMEPAGE}', `${HOMEPAGE}`) + ' */'
  
const terserPlugins = [
  terser({
    output: {
      comments: false,
      preamble: banner
    }
  })
]

const outDir = path.resolve(__dirname, './dist')

export default [{
  input: {  
    'fuse': path.resolve(__dirname, './src/index.js')
  },
  plugins: [
    commonjs(),
    typescript(),
    babel({
      extensions: [
        ...DEFAULT_EXTENSIONS,
        '.ts',
        '.tsx'
      ]
    }),
    copy({
      targets: [
        {
          src: path.resolve(__dirname, './src/typings.d.ts'),
          dest: path.resolve(__dirname, './dist'),
          rename: 'fuse.d.ts',
          transform: (content) => {
            return `// Type definitions for Fuse.js v${VERSION}\n${content}`
          }
        }
      ]
    })
  ],
  output: [
    {
      dir: outDir,
      format: 'umd',
      name: 'Fuse',
      entryFileNames: '[name].js',
      banner: banner,
      sourcemap: true
    },
    {
      dir: outDir,
      format: 'umd',
      name: 'Fuse',
      entryFileNames: '[name].min.js',
      plugins: terserPlugins,
      sourcemap: 'hidden',
    },
    {
      dir: outDir,
      format: 'umd',
      name: 'Fuse',
      entryFileNames: '[name].dev.js',
      banner: banner,
      sourcemap: 'inline',
    },
    {
      dir: outDir,
      format: 'es',
      name: 'Fuse',
      entryFileNames: '[name].es6.js',
      banner: banner,
      sourcemap: true
    },
    {
      dir: outDir,
      format: 'es',
      name: 'Fuse',
      entryFileNames: '[name].es6.min.js',
      plugins: terserPlugins,
      sourcemap: 'hidden'
    }
  ]
}];
