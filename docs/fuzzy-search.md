---
title: Fuzzy Search — Fuse.js
description: How Fuse.js uses the Bitap algorithm for approximate string matching. Configure threshold, distance, location, and scoring to control fuzzy search behavior.
---

# Fuzzy Search

Fuse.js uses a modified [Bitap algorithm](https://en.wikipedia.org/wiki/Bitap_algorithm) for approximate string matching. It finds strings that are _approximately_ equal to a given pattern — tolerating typos, transpositions, and missing characters.

```js
const fuse = new Fuse(['apple', 'banana', 'orange'], {
  includeScore: true
})

fuse.search('aple')
// [{ item: 'apple', refIndex: 0, score: 0.25 }]
```

## How It Works

The Bitap algorithm computes the edit distance between the search pattern and each position in the text. The implementation uses bitwise operations for speed, with a pattern length limit of 32 characters per search term.

The algorithm produces a **fuzziness score** between 0 and 1:

- `0` — perfect match
- `1` — complete mismatch

This score is then combined with key weight and field-length norm to produce the final relevance score.

## Controlling Fuzziness

Three options work together to determine what counts as a match:

### `threshold`

- Default: `0.6`

The cutoff for the fuzziness score. A threshold of `0.0` requires a perfect match. A threshold of `1.0` matches anything.

```js
// Strict matching
const fuse = new Fuse(list, { keys: ['title'], threshold: 0.2 })

// Permissive matching
const fuse = new Fuse(list, { keys: ['title'], threshold: 0.8 })
```

### `location`

- Default: `0`

The expected position of the pattern in the text. The algorithm penalizes matches that are far from this position.

### `distance`

- Default: `100`

How far from `location` a match can be before being penalized to the point of exclusion. The effective search window is:

```
threshold × distance = maximum offset from location
```

With defaults (`threshold: 0.6`, `distance: 100`), the pattern must appear within 60 characters of position 0 to match. For example, searching for `"zero"` in `"Fuse.js is a powerful, lightweight fuzzy-search library, with zero dependencies"` would **not** match — `"zero"` appears at index 62, just outside the window.

### `ignoreLocation`

- Default: `false`

When `true`, disables location-based scoring entirely. The pattern can appear anywhere in the text and still match. This is useful when you don't know or care where the match might be.

```js
const fuse = new Fuse(list, {
  keys: ['description'],
  ignoreLocation: true
})
```

::: tip
The default options effectively search only the first ~60 characters of each field. If your data has long text fields, either increase `distance`, or set `ignoreLocation: true`.
:::

## Other Options

### `isCaseSensitive`

- Default: `false`

When `true`, comparisons are case-sensitive.

### `ignoreDiacritics`

- Default: `false`

When `true`, comparisons ignore diacritics (accents). For example, `é` matches `e`.

### `findAllMatches`

- Default: `false`

When `true`, the algorithm continues searching to the end of the text even after finding a perfect match. Useful when you need all match indices for highlighting.

### `minMatchCharLength`

- Default: `1`

Only return matches whose length exceeds this value. Set to `2` to ignore single-character matches.

## Scoring

The final relevance score for a result combines three factors:

- **Fuzziness score** — the raw Bitap score described above
- **Key weight** — optional per-key `weight` (defaults to `1`). Higher weight = more influence on ranking. Weights are normalized internally.
- **Field-length norm** — shorter fields rank higher. A match in a title is more significant than the same match in a long description.

Scores range from `0` (perfect match) to `1` (complete mismatch). Enable with `includeScore: true`.

### `ignoreFieldNorm`

- Default: `false`

When `true`, field length has no effect on scoring. Useful when you only care whether a term exists, not how prominent it is.

### `fieldNormWeight`

- Default: `1`

Adjusts the strength of the field-length norm. `0` is equivalent to ignoring it. `0.5` reduces the effect. `2.0` amplifies it.
