---
tags:
  - indexing
---

# Indexing

### `Fuse.createIndex`

Pre-generate the index from the list, and pass it directly into the Fuse instance. If the list is (considerably) large, it speeds up instantiation.

**Example**

:::: tabs
::: tab List

```json
[
  {
    "title": "Old Man's War",
    "author": {
      "firstName": "John",
      "lastName": "Scalzi"
    }
  },
  {
    "title": "The Lock Artist",
    "author": {
      "firstName": "Steve",
      "lastName": "Hamilton"
    }
  }
  /*...*/
]
```

:::
::: tab JS

```js
const options = { keys: ['title', 'author.firstName'] }

// Create the Fuse index
const myIndex = Fuse.createIndex(options.keys, books)
// initialize Fuse with the index
const fuse = new Fuse(books, options, myIndex)
```

:::
::::

:::tip
Fuse will automatically index the table if one isn't provided during instantiation.
:::

### `Fuse.parseIndex`

Parses a serialized Fuse index.

**Example**

```js
// (1) In the build step
// Create the Fuse index
const myIndex = Fuse.createIndex(['title', 'author.firstName'], books)
// Serialize and save it
fs.writeFile('fuse-index.json', JSON.stringify(myIndex.toJSON()))

// (2) When app starts
// Load and deserialize index
const fuseIndex = await require('fuse-index.json')
const myIndex = Fuse.parseIndex(fuseIndex)
// initialize Fuse with the index
const fuse = new Fuse(books, options, myIndex)
```

<Donate />
