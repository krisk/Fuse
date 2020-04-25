---
noGlobalSocialShare: true
shareTitle: Fuse.js - JavaScript fuzzy-search library
---

# What is Fuse.js?

<social-share :networks="['twitter', 'reddit', 'linkedin', 'email']" />

Fuse.js is a **powerful, lightweight fuzzy-search library, with zero dependencies**.

### What is fuzzy searching?

Generally speaking, fuzzy searching (more formally known as _approximate string matching_) is the technique of finding strings that are _approximately_ equal to a given pattern (rather than _exactly_).

### Why should I use it?

- With Fuse.js, you don’t need to setup a dedicated backend just to handle search.
- Simplicity and performance were the main criteria when developing this library.

::: details As easy as 1, 2, 3

```js
// 1. List of items to search in
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
]

// 2. Set up the Fuse instance
const fuse = new Fuse(books, {
  keys: ['title', 'author.firstName']
})

// 3. Now search!
fuse.search('jon')

// Output:
// [
//   {
//     item: {
//       title: "Old Man's War",
//       author: {
//         firstName: 'John',
//         lastName: 'Scalzi'
//       }
//     },
//     refIndex: 0
//   }
// ]
```

:::

### When should I use It?

It might not make sense for every situation, but can be ideal depending on your search requirements. For example:

- When you want client-side fuzzy searching of small to moderately large data sets.
- When you can't justify setting up a dedicated backend simply to handle search. ElasticSearch or Algolia, although both great services, may be overkill for your particular use cases.

### Can I still use it on the backend?

Of course! Fuse.js has no DOM dependencies.

---

Check out the [live demo](/demo.html) to fiddle with it and to learn how to use it.
