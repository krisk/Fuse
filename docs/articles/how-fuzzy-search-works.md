---
title: How Fuzzy Search Works
description: An interactive visual explanation of edit distance and the Bitap algorithm — how Fuse.js finds approximate string matches with typo tolerance.
sidebarDepth: 0
head:
  - - link
    - rel: canonical
      href: https://www.fusejs.io/articles/how-fuzzy-search-works.html
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How Fuzzy Search Works",
        "description": "An interactive visual explanation of edit distance and the Bitap algorithm — how Fuse.js finds approximate string matches with typo tolerance.",
        "url": "https://www.fusejs.io/articles/how-fuzzy-search-works.html",
        "datePublished": "2026-04-09",
        "author": {
          "@type": "Person",
          "name": "Kiro Risk"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Fuse.js",
          "url": "https://www.fusejs.io"
        }
      }
---

# How Fuzzy Search Works

<PublishDate date="2026-04-09" />

When you search for "javscript" and Fuse.js returns "JavaScript", it's using **approximate string matching** — finding strings that are _close_ to your query even when they don't match exactly.

The core idea is **edit distance**: the minimum number of single-character operations (insertions, deletions, substitutions) needed to transform one string into another.

For example, turning "javscript" into "javascript" requires:

- **Substitute** `o` → `a` (at position 2)
- **Insert** `a` (at position 4)
- **Insert** `s` (at position 10)

That's an edit distance of 3. The lower the distance relative to the string length, the better the match.

## Edit Distance Demo

Step through the alignment between any two strings to see how edit distance is computed.

<FuzzyMatchDemo />

## From Edit Distance to Fuzziness Score

Fuse.js converts edit distance into a **fuzziness score** between 0 and 1:

- `0` — perfect match (edit distance of 0)
- `1` — complete mismatch

This score is then combined with other factors like key weight and field-length normalization to produce the final relevance ranking.

The `threshold` option (default `0.6`) controls the cutoff — results with a score above the threshold are excluded. Drag the slider to see how it affects which results make the cut:

<ThresholdDemo />

See [Fuzzy Search](/fuzzy-search) for details on configuring threshold, distance, location, and scoring.

## Under the Hood: Bitap

Fuse.js doesn't use a traditional dynamic programming table to compute edit distance. Instead, it uses the [Bitap algorithm](https://en.wikipedia.org/wiki/Bitap_algorithm), which encodes the pattern as bitmasks and uses bitwise operations to check all character positions in parallel. This makes it fast — especially for short patterns.

::: tip Why 32 characters?
The algorithm encodes the pattern as a bitmask and uses bitwise operators (`<<`, `|`, `&`) to process all positions in a single CPU operation. JavaScript's bitwise operators work on 32-bit integers — that's the limit. Longer patterns are split into 32-character chunks and searched independently.
:::

Here's how it works for **exact matching** (zero errors):

1. **Build bitmasks** — for each character in the pattern, create a bitmask where bit `i` is `1` if the character matches position `i`, and `0` otherwise. Fuse.js does this via `createPatternAlphabet()`. For the pattern `test`:

   ```
            t  e  s  t
   mask[t]  1  0  0  1
   mask[e]  0  1  0  0
   mask[s]  0  0  1  0
   ```

2. **Initialize state** — the state vector `R` starts as all `0`s (no matches yet).

   ```
        t  e  s  t
   R =  0  0  0  0
   ```

3. **Scan the text** — for each character, three things happen in a single bitwise operation:
   - **Seed** — a new potential match starts at the first pattern position
   - **Propagate** — existing partial matches advance to the next position
   - **Kill** — any position where the text character doesn't match the pattern is reset to `0`

4. **Match** — when the bit for the last pattern position is `1`, the entire pattern has been matched.

For example, searching for `test` in `"xtest"`:

```
                 t  e  s  t
Start:      R =  0  0  0  0

Read 'x':   R =  0  0  0  0   ← 'x' isn't in the pattern, seed killed
Read 't':   R =  1  0  0  0   ← 't' matches position 0, partial match starts
Read 'e':   R =  0  1  0  0   ← 'e' matches position 1, match continues
Read 's':   R =  0  0  1  0   ← 's' matches position 2, still going
Read 't':   R =  1  0  0  1   ← 't' matches position 3 → full match!
                                  (also starts a new match at position 0)
```

Step through it yourself:

<BitapDemo />

## Handling Typos: Approximate Matching

The demo above only shows exact matching. But Fuse.js is a *fuzzy* search library — it needs to handle typos, missing characters, and extra characters. It does this by running the Bitap algorithm multiple times, allowing one more error each pass.

Instead of a single state vector `R`, Fuse maintains multiple: `R0` (zero errors), `R1` (one error), `R2` (two errors), and so on. When a partial match dies in one level because the characters don't match, it can continue in the next level — counting that mismatch as an error:

- **Substitution** — a partial match in `R0` hits a wrong character. Instead of dying, it continues in `R1` with one error charged.
- **Deletion** — a partial match skips a pattern position (a character is missing from the text). It continues in `R1`.
- **Insertion** — a partial match skips a text character (an extra character in the text). It continues in `R1`.

For example, searching for `test` in `"tset"` (a transposition):

```
                   t  e  s  t
R0 (0 errors):     1  0  0  0   ← 't' matches, but 's' ≠ 'e' — exact match dies
R1 (1 error):      1  1  0  0   ← the mismatch continues here as 1 error
R2 (2 errors):     1  1  1  1   ← another mismatch, 2 errors — still matches!
```

The algorithm stops adding error levels when the score exceeds the `threshold`. This is how `threshold` controls fuzziness — a lower threshold means fewer error levels are tried, requiring closer matches.
