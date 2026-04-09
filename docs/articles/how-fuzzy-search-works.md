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

## Try It

Use the interactive demo below to see how edit distance is computed between any two strings. Hit **Play** to step through the alignment character by character.

<FuzzyMatchDemo />

## From Edit Distance to Fuzziness Score

Fuse.js converts edit distance into a **fuzziness score** between 0 and 1:

- `0` — perfect match (edit distance of 0)
- `1` — complete mismatch

This score is then combined with other factors like key weight and field-length normalization to produce the final relevance ranking. See [Fuzzy Search](/fuzzy-search) for details on configuring thresholds and scoring.

## Under the Hood: Bitap

Fuse.js doesn't use a traditional dynamic programming table to compute edit distance. Instead, it uses the [Bitap algorithm](https://en.wikipedia.org/wiki/Bitap_algorithm), which encodes the pattern as bitmasks and uses bitwise operations to check all character positions in parallel. This makes it fast — especially for short patterns (up to 32 characters).

Here's how it works for **exact matching** (zero errors):

1. **Build bitmasks** — for each character that appears in the pattern, create a bitmask where bit `i` is `0` if the character matches position `i` of the pattern, and `1` otherwise.

2. **Initialize state** — the state vector `R` starts as all `1`s (no matches yet).

3. **Scan the text** — for each character in the text, update the state:
   ```
   R = (R << 1) | mask[current_char]
   ```
   A `0` is shifted in from the left — a new potential match starts at every position. The OR with the character's mask kills any `0` where the character doesn't match, keeping only valid partial matches alive.

4. **Check for match** — if the last bit of `R` is `0`, the entire pattern has been matched.

<BitapDemo />

The key insight is that each bit in `R` tracks whether the pattern matches *up to that position*. A `0` bit means "still matching." Shifting propagates partial matches forward, and the OR with the mask rejects positions where the current character doesn't match.

Fuse.js extends this to **approximate matching** by maintaining multiple state vectors — one per error level. Errors (substitutions, insertions, deletions) allow `0` bits to propagate across error levels, so a match with 1 error is tracked in `R1`, with 2 errors in `R2`, and so on.

<PublishDate date="2026-04-09" />
