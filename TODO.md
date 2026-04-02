# TODO

Triaged from stale-closed issues (April 2026). Items are roughly priority-ordered within each section.

## Bugs

- [x] #798 — `toJSON()` includes `getFn` functions in keys, breaking serialization — **fixed**
- [x] #738 — Number arrays silently fail to index — **fixed**
- [x] #810 — Quoted tokens with inner spaces broken in extended search — **fixed**
- [ ] #712 — `!` exclusion in extended search doesn't work properly across multiple keys — architectural issue, needs design work
- [ ] #762 — Bitap match mask flags characters from the pattern alphabet across the entire text, producing noisy indices — root cause of #781
- [ ] #781 — Match indices include leading spaces when query contains spaces — same root cause as #762
- [x] #730 — Leading space in search pattern changes score — **not a bug**, space is part of the pattern
- [x] #764 — `minMatchCharLength` not filtering — **not a bug**, filters by match span length, not item length
- [x] #785 — Incorrect `refIndex` for nested arrays — **cannot reproduce** on v7.2.0
- [x] #778 — Duplicate indices on long strings — **cannot reproduce** on v7.2.0
- [x] #761 — Indices wrong with parentheses — **cannot reproduce** on v7.2.0
- [x] #725 — Multi-word ranking — **not a bug**, expected Bitap character-level behavior

## Features

- [x] #800 — Allow key-level `getFn` to return null/undefined — **done**
- [x] #765 — Support escaping the `|` operator in extended search — **done**
- [x] #728 — Empty string query returns all docs — **done**
- [x] #816 — Handle non-decomposable diacritics (ł, ø, ß, etc.) — **done**
- [ ] #801 — Export/import index for persistence (avoid re-indexing on reload)
- [ ] #804 — Extend `ignoreDiacritics` to cover Hebrew/Arabic diacritical marks
- [ ] #776 — Add inverse-include (fuzzy exclusion) operator to extended search
- [ ] #806 — Option to match across concatenated key values
- [ ] #779 — Option to disable transposition in fuzzy matching
- [ ] #736 — Support keyless pattern entries in logical queries
