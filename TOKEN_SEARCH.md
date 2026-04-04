# Token Search

Token search splits multi-word queries into individual terms, fuzzy-matches each term independently using the Bitap algorithm, and ranks results using BM25-style IDF weighting. This combines Fuse.js's typo tolerance with relevance ranking — a query like `"javascrpt paterns"` will find `"JavaScript Patterns"`.

## Usage

```js
const fuse = new Fuse(docs, {
  useTokenSearch: true,
  keys: ['title', 'author', 'description']
})

fuse.search('javascrpt paterns')
// → [{ item: { title: 'JavaScript Patterns', ... }, score: 0.12 }]
```

All existing options work as before: `includeScore`, `includeMatches`, `keys` with weights, `threshold`, `limit`, `shouldSort`, etc.

## How it works

1. **Tokenization** — The query is split into individual words. Each word becomes a separate fuzzy search.

2. **Per-term fuzzy matching** — Each term is matched against each field using the Bitap algorithm with `ignoreLocation: true`, so terms can appear anywhere in the field. This means multi-word queries are no longer limited by the 32-character Bitap pattern cap.

3. **IDF weighting** — An inverted index is built at construction time. Rare terms (appearing in fewer documents) are weighted higher than common terms. This means a match on a distinctive word contributes more to the score than a match on a word that appears everywhere.

4. **Score combination** — Per-term scores are combined additively with IDF weights, then normalized to Fuse's 0–1 range (0 = perfect match).

## Key behaviors

- **Partial matching** — A document matching 2 of 3 query terms is still returned, but ranks lower than one matching all 3.
- **Word order independence** — `"patterns javascript"` and `"javascript patterns"` produce identical results.
- **Typo tolerance per term** — Each term is fuzzy-matched independently, so typos in any word are tolerated.
- **Long queries work** — A 6-word query runs 6 independent Bitap searches, each well within the 32-char limit.

## Tips

- Use `threshold` to control fuzziness. The default `0.6` is permissive — for tighter matching, try `0.3` or `0.4`.
- Use `limit` when you only need the top N results. This also improves performance via heap-based selection.
- Key weights still apply on top of token search scoring, so you can boost title matches over body matches.

## Availability

Token search is available in the **full build** (`fuse.js` / `fuse.mjs`). It is not included in the basic build to keep bundle size small. If you use the basic build with `useTokenSearch: true`, an error is thrown.

## Performance

Benchmarked on a corpus of randomly generated documents with 2 keys (title + body):

| Metric | 100 docs | 1,000 docs | 5,000 docs |
|---|---|---|---|
| Index creation overhead | 2.5x | 5.2x | 5.5x |
| Single-term search | 1.8x | 1.8x | 1.7x |
| Multi-term search | 1.3x | 1.3x | 1.2x |

Index creation is a one-time cost (46ms for 5,000 docs). Search overhead is 1.2–1.8x depending on query complexity, primarily because each query term runs its own Bitap search. The inverted index lookup itself is O(1) per term.
