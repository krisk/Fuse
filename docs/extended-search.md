---
title: Extended Search — Fuse.js
description: Use search operators for exact match, prefix, suffix, inverse, and include matching. Combine with AND/OR logic for precise filtering.
---

# Extended Search

Extended search enables unix-like search operators for fine-grained control over matching. Enable it with `useExtendedSearch: true`.

```js
const fuse = new Fuse(list, {
  useExtendedSearch: true,
  keys: ['title', 'author']
})
```

## Operators

| Token | Match Type | Description |
|-------|-----------|-------------|
| `jscript` | fuzzy-match | Items that fuzzy match `jscript` |
| `=scheme` | exact-match | Items that are `scheme` |
| `'python` | include-match | Items that include `python` |
| `!ruby` | inverse-exact-match | Items that do not include `ruby` |
| `^java` | prefix-exact-match | Items that start with `java` |
| `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
| `.js$` | suffix-exact-match | Items that end with `.js` |
| `!.go$` | inverse-suffix-exact-match | Items that do not end with `.go` |

## Combining Operators

- **White space** acts as **AND** — all terms must match.
- **Pipe** (`|`) acts as **OR** — any group must match.

```js
// Items that include "Man" AND "Old", OR end with "Artist"
fuse.search("'Man 'Old | Artist$")
```

This is parsed as two OR groups:

1. `'Man` AND `'Old` — include "Man" and include "Old"
2. `Artist$` — ends with "Artist"

## Quoting

Use double quotes to match phrases containing spaces:

```js
fuse.search('="scheme language"') // exact match for "scheme language"
fuse.search("'^hello world")      // include-match for "hello world"
```

## Example

```js
const books = [
  { title: "Old Man's War", author: 'John Scalzi' },
  { title: 'The Lock Artist', author: 'Steve Hamilton' },
  { title: 'Artist for Life', author: 'Michelangelo' }
]

const fuse = new Fuse(books, {
  useExtendedSearch: true,
  keys: ['title']
})

// Starts with "Old" AND fuzzy match "war"
fuse.search('^Old war')

// Does NOT include "Artist" AND starts with "Old"
fuse.search('!Artist ^Old')

// Ends with "Artist" OR includes "War"
fuse.search("Artist$ | 'War")
```

## Combining with Logical Queries

Extended search operators work inside [logical queries](logical-search.md):

```js
fuse.search({
  $and: [
    { title: '^Old' },     // title starts with "Old"
    { author: "'Scalzi" }  // author includes "Scalzi"
  ]
})
```

## Availability

Extended search is included in the **full build**. To use it with the basic build:

```js
import Fuse from 'fuse.js/basic'
import { ExtendedSearch } from 'fuse.js'

Fuse.use(ExtendedSearch)
```
