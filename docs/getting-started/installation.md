# Installation

<Version />

### npm

```sh
npm install fuse.js
```

### Yarn

```sh
yarn add fuse.js
```

#### Importing

ES6 module syntax:

```js
import Fuse from 'fuse.js'
```

CommonJS:

```js
const Fuse = require('fuse.js')
```

### Direct `<script>` Include

Simply download and include with a script tag. `Fuse` will be registered as a global variable.

#### CDN

For prototyping or learning purposes, you can use the latest version with:

```html
<script src="https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js"></script>
```

For production, we recommend linking to a specific version number and build to avoid unexpected breakage from newer versions:

```html
<script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
```

If you are using native ES Modules, there is also an ES Modules compatible build:

```html
<script type="module">
  import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs'
</script>
```

You can browse the source of the npm package at [cdn.jsdelivr.net/npm/fuse.js](https://cdn.jsdelivr.net/npm/fuse.js).

Fuse.js is also available on [unpkg](https://unpkg.com/fuse.js).

Make sure to read about [the different builds of Fuse.js](different-builds.html) and use the production
version in your published site, replacing `fuse.js` with `fuse.min.js`. This is a smaller build optimized for speed instead of development experience.

### Deno

You can directly import `Fuse` as an ES module from the deno.land/x service:

```typescript
// @deno-types="https://deno.land/x/fuse@v7.0.0/dist/fuse.d.ts"
import Fuse from 'https://deno.land/x/fuse@v7.0.0/dist/fuse.min.mjs'
```

<Donate />
