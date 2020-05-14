# Explanation of Different Builds

In the [`dist/` directory of the NPM package](https://cdn.jsdelivr.net/npm/fuse.js/dist/) you will find many different builds of Fuse.js. Here's an overview of the difference between them.

|                        | UMD               | CommonJS             | ES Module (for bundlers) |
| ---------------------- | ----------------- | -------------------- | ------------------------ |
| **Full**               | fuse.js           | fuse.common.js       | fuse.esm.js              |
| **Basic**              | fuse.basic.js     | fuse.basic.common.js | fuse.basic.esm.js        |
| **Full (Production)**  | fuse.min.js       | -                    | fuse.esm.min.js          |
| **Basic (Production)** | fuse.basic.min.js | -                    | fuse.basic.esm.min.js    |

### Terms

- **Full**: Builds that contain standard fuzzy searching, [extended searching](/examples.html#extended-search), and [logical query operations](/api/query.html). These builds are larger.

- **Basic**: Builds that contain only standard fuzzy searching.

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from jsDelivr CDN at https://cdn.jsdelivr.net/npm/fuse.js is the UMD build (`fuse.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The file for these bundlers (`pkg.main`) is the CommonJS build (`fuse.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: Intended for use with modern bundlers like [Webpack 2](https://webpack.js.org) or [Rollup](http://rollupjs.org/). The file for these bundlers (`pkg.module`) is the ES Module build (`fuse.esm.js`).
