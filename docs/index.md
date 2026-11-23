---
title: Fuse.js — Lightweight Fuzzy-Search Library
description: Powerful, lightweight fuzzy-search library for JavaScript with zero dependencies. Supports fuzzy matching, token search, extended search operators, and logical queries.
---

# Fuse.js

**Lightweight fuzzy-search library, with zero dependencies.**

<UsedBy />

## Quick Example

```js
import Fuse from 'fuse.js'

const books = [
  { title: "Old Man's War", author: 'John Scalzi' },
  { title: 'The Lock Artist', author: 'Steve Hamilton' },
  { title: 'JavaScript Patterns', author: 'Stoyan Stefanov' }
]

const fuse = new Fuse(books, {
  keys: ['title', 'author'],
  includeScore: true
})

fuse.search('jon')
// [{ item: { title: "Old Man's War", author: "John Scalzi" }, refIndex: 0, score: 0.25 }]

fuse.search('patterns')
// [{ item: { title: "JavaScript Patterns", ... }, refIndex: 2, score: 0.0 }]
```

::: tip Try the 7.6 beta: fuzzy search is 3–10x faster
`npm install fuse.js@beta`. Fuzzy and token search are much faster, with the same results in almost every case. If your rankings change or anything looks off, [tell me in the beta feedback discussion](https://github.com/krisk/Fuse/discussions/869). It helps decide what ships in 7.6.0.
:::

## Features

- **[Fuzzy search](fuzzy-search.md)** — typo-tolerant matching powered by a fast bit-parallel matcher
- **[Token search](token-search.md)** — split multi-word queries into terms, fuzzy-match each, rank with IDF
- **[Extended search](extended-search.md)** — operators for exact, prefix, suffix, inverse, and include matching
- **[Logical search](logical-search.md)** — `$and` / `$or` expressions for structured queries
- **Weighted keys** — boost fields like `title` over `description`
- **Nested search** — dot notation, array notation, or custom `getFn`
- **Zero dependencies** — works in the browser, Node.js, and Deno
- **Two builds** — full (~8.6 kB gzip) or basic (~6.8 kB gzip)

## Get Started

```sh
npm install fuse.js
```

See [Getting Started](getting-started.md) for installation options, builds, and imports.

**[Try the live demo →](demo.md)**

::: tip Building for Apple platforms?
**[fuse-swift](https://github.com/krisk/fuse-swift)** is the official Swift port for iOS, macOS, tvOS, watchOS, visionOS, and Linux. Byte-equivalent results, idiomatic Swift API. Currently in release candidate.
:::


<!-- <Sponsor /> -->
