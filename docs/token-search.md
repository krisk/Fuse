---
title: Token Search — Fuse.js
description: Split multi-word queries into terms, fuzzy-match each with the Bitap algorithm, and rank results using BM25-style IDF weighting. Handles typos per word independently.
---

# Token Search <Badge type="tip" text="New" />

Token search splits multi-word queries into individual terms, fuzzy-matches each term independently using the Bitap algorithm, and ranks results using BM25-style IDF weighting.

```js
const fuse = new Fuse(docs, {
  useTokenSearch: true,
  keys: ['title', 'author', 'description']
})

fuse.search('javascrpt paterns')
// → [{ item: { title: 'JavaScript Patterns', ... }, score: 0.12 }]
```

All standard options work as before: `includeScore`, `includeMatches`, `keys` with weights, `threshold`, `limit`, `shouldSort`, etc.

## How It Works

1. **Tokenization** — The query is split into individual words using word boundary matching (`\b\w+\b`). Each word becomes a separate fuzzy search.

2. **Per-term fuzzy matching** — Each term is matched against each field using the Bitap algorithm with `ignoreLocation: true`, so terms can appear anywhere in the field. This means multi-word queries are no longer limited by the 32-character Bitap pattern cap.

3. **IDF weighting** — An inverted index is built at construction time. The IDF weight for each term uses the BM25 formula:

   ```
   idf = log(1 + (fieldCount - docFreq + 0.5) / (docFreq + 0.5))
   ```

   Rare terms (appearing in fewer documents) are weighted higher than common terms. A match on a distinctive word contributes more to the score than a match on a ubiquitous one.

4. **Score combination** — Per-term scores are combined additively with IDF weights, then normalized to Fuse's 0–1 range (0 = perfect match).

## Key Behaviors

- **Partial matching** — A document matching 2 of 3 query terms still returns, but ranks lower than one matching all 3.
- **Word order independence** — `"patterns javascript"` and `"javascript patterns"` produce identical results.
- **Typo tolerance per term** — Each term is fuzzy-matched independently, so typos in any word are tolerated.
- **Long queries work** — A 6-word query runs 6 independent Bitap searches, each within the 32-char limit.

## Tips

- Use `threshold` to control fuzziness. The default `0.6` is permissive — for tighter matching, try `0.3` or `0.4`.
- Use `limit` when you only need the top N results. This also improves performance via heap-based selection.
- Key weights still apply on top of token search scoring, so you can boost title matches over body matches.

## Dynamic Collection Updates

The inverted index is maintained as you modify the collection:

```js
const fuse = new Fuse(docs, { useTokenSearch: true, keys: ['title'] })

// Adding a document updates the inverted index
fuse.add({ title: 'New Book' })

// Removing documents also updates the index
fuse.remove((doc) => doc.title === 'Old Book')
```

## Performance

Benchmarked on randomly generated documents with 2 keys (title + body):

| Metric | 100 docs | 1,000 docs | 5,000 docs |
|---|---|---|---|
| Index creation overhead | 2.5x | 5.2x | 5.5x |
| Single-term search | 1.8x | 1.8x | 1.7x |
| Multi-term search | 1.3x | 1.3x | 1.2x |

Index creation is a one-time cost (46ms for 5,000 docs). Search overhead is 1.2–1.8x depending on query complexity, primarily because each query term runs its own Bitap search. The inverted index lookup itself is O(1) per term.

## Availability

Token search is available in the **full build** only (`fuse.js` / `fuse.mjs`). It is not included in the basic build to keep bundle size small. Using `useTokenSearch: true` with the basic build throws an error.

To use token search, use the full build.
