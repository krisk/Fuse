---
title: Logical Search
description: Build structured queries with $and and $or operators. Nest expressions, combine with extended search, and handle dotted keys with $path/$val.
---

# Logical Search

Fuse.js supports structured logical queries using `$and` and `$or` operators. Instead of passing a string to `search()`, pass an expression object.

## `$and`

Returns documents that match **all** clauses. Uses short-circuit evaluation — if the first expression is false, remaining expressions are skipped.

```js
const result = fuse.search({
  $and: [{ author: 'abc' }, { title: 'xyz' }]
})
```

## `$or`

Returns documents that match **any** clause. Uses short-circuit evaluation — if the first expression is true, remaining expressions are skipped.

```js
const result = fuse.search({
  $or: [{ author: 'abc' }, { author: 'def' }]
})
```

## Nesting

`$and` and `$or` can be nested arbitrarily:

```js
const result = fuse.search({
  $and: [
    { title: 'old war' },
    {
      $or: [
        { title: '^lock' },
        { title: '!arts' }
      ]
    }
  ]
})
```

## Implicit AND

When specifying a comma-separated list of expressions within an object, Fuse.js performs an implicit AND. Use explicit `$and` when the same field or operator appears in multiple expressions.

## Dotted Keys

If your data has keys containing literal dots (e.g., `"first.name"` as a single key, not a nested path), use `$path` and `$val`:

```js
const books = [
  {
    title: "Old Man's War",
    author: { 'first.name': 'John', 'last.name': 'Scalzi' }
  }
]

const fuse = new Fuse(books, {
  keys: ['title', ['author', 'first.name'], ['author', 'last.name']]
})

const result = fuse.search({
  $and: [
    { $path: ['author', 'first.name'], $val: 'jon' },
    { $path: ['author', 'last.name'], $val: 'scazi' }
  ]
})
```

## With Extended Search

Logical queries pair well with [extended search operators](extended-search.md). When `useExtendedSearch` is enabled, the string values in logical expressions are parsed as extended search patterns:

```js
const fuse = new Fuse(books, {
  useExtendedSearch: true,
  keys: ['title', 'color']
})

const result = fuse.search({
  $and: [
    { title: 'old war' },      // fuzzy match "old war"
    { color: "'blue" },         // exact include "blue"
    {
      $or: [
        { title: '^lock' },     // starts with "lock"
        { title: '!arts' }      // does not contain "arts"
      ]
    }
  ]
})
```
