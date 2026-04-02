# TODO

Triaged from stale-closed issues (April 2026). Items are roughly priority-ordered within each section.

## Bugs

- [ ] #798 — `toJSON()` includes `getFn` functions in keys, breaking serialization to IndexedDB
- [ ] #712 — `!` exclusion in extended search doesn't work properly across multiple keys
- [ ] #730 — Leading space in search pattern drastically changes the score
- [ ] #762 — `threshold: 0` with `ignoreLocation: true` returns non-perfect matches
- [ ] #764 — `minMatchCharLength` does not filter results as expected
- [ ] #785 — Incorrect `refIndex` for nested array field matches
- [ ] #781 — Match indices include leading spaces when query contains spaces
- [ ] #778 — Duplicate indices in match results on long strings
- [ ] #761 — Indices incorrect when search pattern contains parentheses
- [ ] #725 — Multi-word search ranks non-matching item equal to correct match

## Features

- [ ] #801 — Export/import index for persistence (avoid re-indexing on reload)
- [ ] #800 — Allow key-level `getFn` to return null/undefined
- [ ] #765 — Support escaping the `|` operator in extended search
- [ ] #804 — Extend `ignoreDiacritics` to cover Hebrew/Arabic diacritical marks
- [ ] #776 — Add inverse-include (fuzzy exclusion) operator to extended search
- [ ] #806 — Option to match across concatenated key values
- [ ] #779 — Option to disable transposition in fuzzy matching
- [ ] #736 — Support keyless pattern entries in logical queries
- [ ] #728 — Option to return all results when query is empty
