---
tags:
  - indexing
---

# Indexing

Use `Fuse.createIndex` to pre-generate the index from the list, and pass it directly into the Fuse instance.

```js
const books = [
  {
    title: "Old Man's War",
    author: {
      firstName: 'John',
      lastName: 'Scalzi'
    }
  },
  {
    title: 'The Lock Artist',
    author: {
      firstName: 'Steve',
      lastName: 'Hamilton'
    }
  }
  /*...*/
]

const options = { keys: ['title', 'author.firstName'] }

// Create the Fuse index
const myIndex = Fuse.createIndex(options.keys, books)

const myFuse = new Fuse(books, options, myIndex)
```

::: tip
For very large datasets, especially those with large strings, consider pre-generating the index with `Fuse.createIndex`. This will speed up instantiation.
:::
