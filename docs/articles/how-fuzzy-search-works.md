---
title: How Fuzzy Search Works
description: An interactive visual explanation of edit distance and approximate string matching — the core concept behind Fuse.js fuzzy search.
---

# How Fuzzy Search Works

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

This score is then combined with other factors like key weight and field-length normalization to produce the final relevance ranking. See [Fuzzy Search](/fuzzy-search) for details on configuring thresholds and scoring.

## Under the Hood: Bitap

Fuse.js doesn't use a traditional dynamic programming table to compute edit distance. Instead, it uses the [Bitap algorithm](https://en.wikipedia.org/wiki/Bitap_algorithm), which encodes the pattern as bitmasks and uses bitwise operations to check all character positions in parallel. This makes it fast — especially for short patterns (up to 32 characters).

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

Fuse.js extends this to **approximate matching** by maintaining multiple state vectors — one per error level. Errors (substitutions, insertions, deletions) allow `1` bits to propagate across error levels, so a match with 1 error is tracked in `R1`, with 2 errors in `R2`, and so on.

<PublishDate date="2026-04-09" />
