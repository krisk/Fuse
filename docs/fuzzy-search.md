---
title: Fuzzy Search
description: How Fuse.js does approximate string matching with a single-pass bit-parallel algorithm. Configure threshold, distance, location, and scoring to control fuzzy search behavior.
---

# Fuzzy Search

Fuse.js uses a bit-parallel approximate string matching algorithm (Myers' algorithm by default, with [Bitap](https://en.wikipedia.org/wiki/Bitap_algorithm) available as an alternative). It finds strings that are _approximately_ equal to a given pattern — tolerating typos, transpositions, and missing characters.

```js
const fuse = new Fuse(['apple', 'banana', 'orange'], {
  includeScore: true
})

fuse.search('aple')
// [{ item: 'apple', refIndex: 0, score: 0.25 }]
```

## How It Works

For every position in the text, the matcher finds the fewest edits (insertions, deletions, substitutions) needed to match the pattern starting there, then picks the best-scoring position. The default algorithm (Myers) does this in a single pass over the text, using bitwise operations for speed. Patterns longer than 32 characters are matched in 32-character chunks whose scores are averaged.

The algorithm produces a **fuzziness score** between 0 and 1:

- `0` — perfect match
- `1` — complete mismatch

This score is then combined with key weight and field-length norm to produce the final relevance score.

::: tip
See [How Fuzzy Search Works](/articles/how-fuzzy-search-works) for an interactive walkthrough of edit distance.
:::

## Controlling Fuzziness

Three options work together to determine what counts as a match:

#### `threshold`

- Default: `0.6`

The cutoff for the fuzziness score. A threshold of `0.0` requires a perfect match. A threshold of `1.0` matches anything.

#### `location`

- Default: `0`

The expected position of the pattern in the text. The algorithm penalizes matches that are far from this position.

#### `distance`

- Default: `100`

How far from `location` a match can be before being penalized to the point of exclusion. The effective search window is:

`threshold` × `distance` = maximum offset from `location`

::: info
With defaults (`threshold: 0.6`, `distance: 100`), the pattern must appear within 60 characters of position 0 to match. For example, searching for `"zero"` in `"Fuse.js is a powerful, lightweight fuzzy-search library, with zero dependencies"` would **not** match — `"zero"` appears at index 62, just outside the window.
:::

#### `ignoreLocation`

- Default: `false`

When `true`, disables location-based scoring entirely. The pattern can appear anywhere in the text and still match. This is useful when you don't know or care where the match might be.

::: tip
The default options effectively search only the first ~60 characters of each field. If your data has long text fields, either increase `distance`, or set `ignoreLocation: true`.
:::

Try adjusting `threshold`, `location`, and `distance` below to see how they interact.

<SearchWindowDemo />

## Match Algorithm

#### `matchAlgorithm`

- Default: `'myers'`
- Values: `'myers'`, `'bitap'`

The algorithm used for fuzzy matching. `'myers'` finds the best match in a single pass over each text and applies the scoring formula exactly. `'bitap'` is the algorithm Fuse.js used before 7.6. It rescans the text once for each typo it allows, so it gets slower as `threshold` gets more lenient.

The two return the same results, scores and match indices at normal settings. They can differ in two narrow cases:

- **`distance` smaller than the query length** (per 32-character chunk). The scoring formula then lets a match count leading text characters as typos to start closer to `location`. Myers applies that consistently; Bitap only partly, depending on its scan window. For example, with `distance: 5`, `'javascript'` matches `'the javascript handbook'` under Myers (score 0.4) but not under Bitap.
- **A non-integer `location`.** Bitap can miss a match; Myers evaluates the formula at every position.

Set `matchAlgorithm: 'bitap'` if you need results identical to earlier versions in those cases.

```js
const fuse = new Fuse(list, { matchAlgorithm: 'bitap' })
```

## Other Options

#### `isCaseSensitive`

- Default: `false`

When `true`, comparisons are case-sensitive.

#### `ignoreDiacritics`

- Default: `false`

When `true`, comparisons ignore diacritics (accents). For example, `é` matches `e`.

#### `findAllMatches`

- Default: `false`

When `true`, the algorithm continues searching to the end of the text even after finding a perfect match. Useful when you need all match indices for highlighting.

#### `minMatchCharLength`

- Default: `1`

Only return matches whose length exceeds this value. Set to `2` to ignore single-character matches.

## Scoring

The final relevance score for a result combines three factors:

- **Fuzziness score** — the raw score described above
- **Key weight** — optional per-key `weight` (defaults to `1`). Higher weight = more influence on ranking. Weights are normalized internally.
- **Field-length norm** — shorter fields rank higher. A match in a title is more significant than the same match in a long description.

Scores range from `0` (perfect match) to `1` (complete mismatch). Enable with `includeScore: true`.

#### `ignoreFieldNorm`

- Default: `false`

When `true`, field length has no effect on scoring. Useful when you only care whether a term exists, not how prominent it is.

#### `fieldNormWeight`

- Default: `1`

Adjusts the strength of the field-length norm. `0` is equivalent to ignoring it. `0.5` reduces the effect. `2.0` amplifies it.
