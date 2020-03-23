## Explanation of Build Files

|                 | UMD         | CommonJS       | ES Module (for bundlers) |
| --------------- | ----------- | -------------- | ------------------------ |
| **Development** | fuse.js     | fuse.common.js | fuse.esm.js              |
| **Production**  | fuse.min.js | -              | -                        |

### Terms

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from jsDelivr CDN at https://cdn.jsdelivr.net/npm/fuse.js is the UMD build (`fuse.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The file for these bundlers (`pkg.main`) is the CommonJS build (`fuse.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: Intended for use with modern bundlers like [Webpack 2](https://webpack.js.org) or [Rollup](http://rollupjs.org/). The file for these bundlers (`pkg.module`) is the ES Module build (`fuse.esm.js`).
