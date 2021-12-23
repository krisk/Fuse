---
tags:
  - configuration
---

# Options

## Basic Options

### `isCaseSensitive`

- Type: `boolean`
- Default: `false`

Indicates whether comparisons should be case sensitive.

### `includeScore`

- Type: `boolean`
- Default: `false`

Whether the score should be included in the result set. A score of `0`indicates a perfect match, while a score of `1` indicates a complete mismatch.

### `includeMatches`

- Type: `boolean`
- Default: `false`

Whether the matches should be included in the result set. When `true`, each record in the result set will include the indices of the matched characters. These can consequently be used for highlighting purposes.

### `minMatchCharLength`

- Type: `number`
- Default: `1`

Only the matches whose length exceeds this value will be returned. (For instance, if you want to ignore single character matches in the result, set it to `2`).

### `shouldSort`

- Type: `boolean`
- Default: `true`

Whether to sort the result list, by score.

### `findAllMatches`

- Type: `boolean`
- Default: `false`

When true, the matching function will continue to the end of a search pattern even if a perfect match has already been located in the string.

### `keys`

- Type: `Array`
- Default: `[]`

List of keys that will be searched. This supports nested paths, weighted search, searching in arrays of [strings](/examples.html#search-string-array) and [objects](/examples.html#nested-search).

## Fuzzy Matching Options

<!-- ::: warning
You shouldn't have to change these.
::: -->

### `location`

- Type: `number`
- Default: `0`

Determines approximately where in the text is the pattern expected to be found.

### `threshold`

- Type: `number`
- Default: `0.6`

At what point does the match algorithm give up. A threshold of `0.0` requires a perfect match (of both letters and location), a threshold of `1.0` would match anything.

### `distance`

- Type: `number`
- Default: `100`

Determines how close the match must be to the fuzzy location (specified by `location`). An exact letter match which is `distance` characters away from the fuzzy location would score as a complete mismatch. A `distance` of `0` requires the match be at the exact `location` specified. A distance of `1000` would require a perfect match to be within `800` characters of the `location` to be found using a `threshold` of `0.8`.

### `ignoreLocation`

- Type: `boolean`
- Default: `false`

When `true`, search will ignore `location` and `distance`, so it won't matter where in the string the pattern appears.

::: tip

The default options only search the first 60 characters. This should suffice if it is reasonably expected that the match is within this range. To modify this behavior, set the appropriate combination of `location`, `threshold`, `distance` (or `ignoreLocation`).

To better understand how these options work together, read our [Scoring Theory](/concepts/scoring-theory.html#scoring-theory).
:::

## Advanced Options

### `useExtendedSearch`

- Type: `boolean`
- Default: `false`

When `true`, it enables the use of unix-like search commands. See [example](/examples.html#extended-search).

### `getFn`

- Type: `Function`
- Default: `(obj: T, path: string | string[]) => string | string[]`

The function to use to retrieve an object's value at the provided path. The default will also search nested paths.

### `sortFn`

- Type: `Function`
- Default: `(a, b) => number`

The function to use to sort all the results. The default will sort by ascending relevance score, ascending index.

### `ignoreFieldNorm`

- Type: `boolean`
- Default: `false`

When `true`, the calculation for the relevance score (used for sorting) will ignore the [field-length norm](/concepts/scoring-theory.html#fuzziness-score).

:::tip
The only time it makes sense to set `ignoreFieldNorm` to `true` is when it does not matter how many terms there are, but only that the query term exists.
:::

### `fieldNormWeight`

- Type: `number`
- Default: `1`

Determines how much the [field-length norm](/concepts/scoring-theory.html#field-length-norm) affects scoring. A value of `0` is equivalent to ignoring the field-length norm. A value of `0.5` will greatly reduce the effect of field-length norm, while a value of `2.0` will greatly increase it.

<Donate />
