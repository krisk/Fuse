# TODO

Triaged from stale-closed issues (April 2026).

## Open Bugs

- [ ] #712 — `!` exclusion in extended search doesn't work properly across multiple keys — architectural issue, needs design work

## Resolved

### Bugs
- [x] #798 — `toJSON()` serialization — **fixed**
- [x] #738 — Number arrays not indexed — **fixed**
- [x] #810 — Quoted tokens with inner spaces — **fixed**
- [x] #816 — Non-decomposable diacritics (ł, ø, ß) — **fixed**
- [x] #730, #764, #725, #748, #759, #750, #718, #713 — **not bugs**
- [x] #785, #778, #761, #745 — **cannot reproduce** on v7.2.0
- [x] #788, #780 — **fixed by TS rewrite**
- [x] #792 — same root cause as #762

### Features
- [x] #800 — `getFn` returns null/undefined — **done**
- [x] #765 — Escape `\|` in extended search — **done**
- [x] #728 — Empty query returns all docs — **done**
- [x] #736 — Keyless entries in logical queries — **done**
- [x] #801 — Export/import index — **already works** via `toJSON()`/`parseIndex()`
- [x] #804 — Hebrew diacritics — **already works** with `ignoreDiacritics: true`
- [x] #776 — Inverse-include operator — **already works**, `!` uses indexOf
- [x] #806 — Match across keys — **by design**, use `$and`/`$or` logical queries
- [x] #779 — Disable transposition — **not applicable**, Bitap doesn't have transposition
