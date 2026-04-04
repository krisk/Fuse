---
title: Getting Started
description: Install Fuse.js via npm, yarn, or CDN. Quick start guide with code examples, build variants, and import paths for ES modules and CommonJS.
---

# Getting Started

## Installation

```sh
npm install fuse.js
```

```sh
yarn add fuse.js
```

### Importing

ES Module:

```js
import Fuse from 'fuse.js'
```

CommonJS:

```js
const Fuse = require('fuse.js')
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/fuse.js@7.3.0"></script>
```

ES Module via CDN:

```html
<script type="module">
  import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.3.0/dist/fuse.mjs'
</script>
```

Also available on [unpkg](https://unpkg.com/fuse.js).

### Deno

```typescript
// @deno-types="https://deno.land/x/fuse@v7.3.0/dist/fuse.d.ts"
import Fuse from 'https://deno.land/x/fuse@v7.3.0/dist/fuse.min.mjs'
```

## Quick Start

```js
import Fuse from 'fuse.js'

const books = [
  { title: "Old Man's War", author: 'John Scalzi' },
  { title: 'The Lock Artist', author: 'Steve Hamilton' }
]

const fuse = new Fuse(books, {
  keys: ['title', 'author']
})

const results = fuse.search('jon')
// [{ item: { title: "Old Man's War", author: "John Scalzi" }, refIndex: 0 }]
```

Fuse.js searches the `keys` you specify and returns results ranked by relevance. A score of `0` is a perfect match; `1` is a complete mismatch.

## Builds

Fuse.js ships two builds:

| Build | Includes | Gzip |
|-------|----------|------|
| **Full** | Fuzzy search + extended search + token search | ~8 kB |
| **Basic** | Fuzzy search only | ~6.5 kB |

Import paths:

```js
// Full build (default)
import Fuse from 'fuse.js'

// Basic build
import Fuse from 'fuse.js/basic'

// Minified variants
import Fuse from 'fuse.js/min'
import Fuse from 'fuse.js/min-basic'
```

Build files in `dist/`:

| | UMD | CommonJS | ES Module |
|---|---|---|---|
| **Full** | fuse.js | fuse.cjs | fuse.mjs |
| **Basic** | fuse.basic.js | fuse.basic.cjs | fuse.basic.mjs |
| **Full (min)** | fuse.min.js | — | fuse.min.mjs |
| **Basic (min)** | fuse.basic.min.js | — | fuse.basic.min.mjs |

The basic build does not include extended search or token search. If you need those features with the basic build, register them at runtime with `Fuse.use()`:

```js
import Fuse from 'fuse.js/basic'
import { ExtendedSearch } from 'fuse.js'

Fuse.use(ExtendedSearch)
```
