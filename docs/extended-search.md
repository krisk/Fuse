---
title: Extended Search
description: Use search operators for exact match, prefix, suffix, inverse, and include matching. Combine with AND/OR logic for precise filtering.
---

# Extended Search

Extended search enables unix-like search operators for fine-grained control over matching. Enable the **string** operators below with `useExtendedSearch: true`.

```js
const fuse = new Fuse(list, {
  useExtendedSearch: true,
  keys: ['title', 'author']
})
```

::: tip Prefer the object syntax?
The same operators are available as a self-documenting, type-safe **[object syntax](#object-syntax)** (`{ title: { $startsWith: 'old' } }`) that does **not** require `useExtendedSearch`. The `useExtendedSearch` flag exists only to opt into parsing the magic characters (`^`, `=`, `!`, …) in query strings; object operators are unambiguous, so they need no flag.
:::

## Operators

| Token       | Match Type                 | Description                            |
| ----------- | -------------------------- | -------------------------------------- |
| `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
| `=scheme`   | exact-match                | Items that are `scheme`                |
| `'python`   | include-match              | Items that include `python`            |
| `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
| `^java`     | prefix-exact-match         | Items that start with `java`           |
| `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
| `.js$`      | suffix-exact-match         | Items that end with `.js`              |
| `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |

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
fuse.search("'^hello world") // include-match for "hello world"
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
    { title: '^Old' }, // title starts with "Old"
    { author: "'Scalzi" } // author includes "Scalzi"
  ]
})
```

## Object Syntax

Instead of encoding the match type in magic characters inside a string, you can express it structurally with `$`-prefixed operators. Object queries are self-documenting, autocomplete in TypeScript, need no quoting or escaping, and — unlike the string operators — do **not** require `useExtendedSearch`.

```js
const fuse = new Fuse(books, { keys: ['title', 'author'] })

fuse.search({ title: { $startsWith: 'old' } })
```

### Operators

Each object operator maps to one of the string operators above:

| Operator      | String equivalent | Description                                 |
| ------------- | ----------------- | ------------------------------------------- |
| `$fuzzy`      | `term`            | Typo-tolerant (edit-distance) fuzzy match   |
| `$eq`         | `=term`           | The whole candidate string equals the value |
| `$contains`   | `'term`           | Candidate contains the value (substring)    |
| `$startsWith` | `^term`           | Candidate starts with the value             |
| `$endsWith`   | `term$`           | Candidate ends with the value               |

::: warning `$eq` means whole-string equality
`$eq` matches when the **entire** candidate string equals the value, not an "exact token" or phrase within it (the sense the word "exact" has in some search engines). Likewise `$fuzzy` is typo-tolerant edit-distance matching (what some tools call "typo tolerance"). `$ne` is reserved for a possible future whole-string **inequality** operator.
:::

### Negation

`$not` negates exactly **one** operator:

```js
fuse.search({ title: { $not: { $contains: 'draft' } } }) // === '!draft'
fuse.search({ title: { $not: { $startsWith: 'old' } } }) // === '!^old'
fuse.search({ title: { $not: { $endsWith: '.go' } } }) // === '!.go$'
```

It sits alongside other operators in the same field, and they AND together:

```js
// starts with "old" AND does not contain "draft"
fuse.search({ title: { $startsWith: 'old', $not: { $contains: 'draft' } } })
```

Two restrictions, both enforced at compile time and at runtime:

- **Exactly one operator inside.** `{ $not: { $contains: 'a', $endsWith: 'b' } }` throws. It would be ambiguous: read as a conjunction, `NOT(A AND B)` is `NOT A OR NOT B`, an OR that cannot live inside an AND group without the combinatorial expansion this grammar excludes. Write the disjunction explicitly with `$or` instead.
- **Only `$contains`, `$startsWith`, and `$endsWith` can be negated.** `$fuzzy` is graded rather than boolean, so its negation has no meaningful score or match indices, and whole-string inequality (the negation of `$eq`) has no matcher yet.

### Values are literal

Operator values are taken verbatim — there is no re-tokenization or magic. `{ $fuzzy: 'old war' }` is a single fuzzy phrase (equivalent to the quoted string `'"old war"'`), **not** two terms. To AND two terms, use `$and` (below).

### Combining operators

Within one field:

- **Multiple operators** in one object are **AND**ed.
- **`$or: [...]`** gives OR groups (any group may match).
- **`$and: [...]`** ANDs clauses — needed to repeat the same operator, since object keys can't (`{ $fuzzy: 'old', $fuzzy: 'war' }` is invalid JS).

```js
// starts with "old" AND ends with "war"
fuse.search({ title: { $startsWith: 'old', $endsWith: 'war' } })

// starts with "old" OR ends with "war"   (=== string:  '^old | war$')
fuse.search({ title: { $or: [{ $startsWith: 'old' }, { $endsWith: 'war' }] } })

// fuzzy "old" AND fuzzy "war"   (=== string:  'old war')
fuse.search({ title: { $and: [{ $fuzzy: 'old' }, { $fuzzy: 'war' }] } })
```

Field-local composition is a two-level OR-of-ANDs. For deeper composition, nest with [logical queries](logical-search.md) across fields — object leaves work anywhere a string leaf does, and nest without limit:

```js
fuse.search({
  $and: [
    { category: { $eq: 'fiction' } },
    {
      $or: [
        { title: { $startsWith: 'old' } },
        { author: { $contains: 'scalzi' } }
      ]
    }
  ]
})
```

### Strict validation

Object queries are validated. Unknown operators, empty values, non-string values, and illegal nesting throw immediately rather than silently degrading to a fuzzy search:

```js
fuse.search({ title: { $startWith: 'old' } }) // throws: Unknown query operator '$startWith'
fuse.search({ title: { $startsWith: '' } }) // throws: Empty value for operator '$startsWith' on key 'title'
```

## Availability

Extended search is included in the **full build**. The **string** operators can also be added to the basic build:

```js
import Fuse from 'fuse.js/basic'
import { ExtendedSearch } from 'fuse.js'

Fuse.use(ExtendedSearch) // enables the string operators only
```

::: warning Object syntax requires the full build
`Fuse.use(ExtendedSearch)` registers the **string** operators only. The [object syntax](#object-syntax) additionally depends on logical search, which the basic build excludes, so object queries on a basic build throw `Logical search is not available`. Use the full build (`fuse.js`) for object syntax.
:::
