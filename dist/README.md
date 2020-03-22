## Explanation of Build Files

|                 | UMD         | CommonJS       | ES Module (for bundlers) | ES Module (for direct import in browser) |
| --------------- | ----------- | -------------- | ------------------------ | ---------------------------------------- |
| **Development** | fuse.js     | fuse.common.js | fuse.esm.js              | fuse.esm.browser.js                      |
| **Production**  | fuse.min.js | -              | -                        | fuse.esm.browser.min.js                  |

### Terms

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from jsDelivr CDN at https://cdn.jsdelivr.net/npm/fuse.js is the UMD build (`fuse.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the CommonJS build (`fuse.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: Fuse.js provides two ES Modules (ESM) builds:
  - **ESM for bundlers**: intended for use with modern bundlers like [Webpack 2](https://webpack.js.org) or [Rollup](http://rollupjs.org/). ESM format is designed to be statically analyzable so the bundlers can take advantage of that to perform “tree-shaking” and eliminate unused code from your final bundle. The default file for these bundlers (`pkg.module`) is the ES Module build (`fuse.esm.js`).
  - **ESM for browsers**: intended for direct imports in modern browsers via `<script type="module">`.
