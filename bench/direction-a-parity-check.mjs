/**
 * Direction A1 parity check (Plan 008)
 *
 * Plan 008's Direction A1 narrows candidate docs by expanding the query term
 * over the analyzer-tokenized term dictionary, then restricting BitapSearch to
 * docs whose postings include any expanded token. The plan's recall gate
 * requires bit-identical results vs. baseline on these fixtures.
 *
 * This script verifies the BASELINE behavior (what A1 must reproduce) on the
 * cross-separator fixture. The structural argument below explains why A1
 * cannot match it.
 *
 * Run:
 *   node bench/direction-a-parity-check.mjs
 */

import Fuse from '../dist/fuse.mjs'

function showHits(label, fuse, query) {
  const hits = fuse.search(query).map((r) => ({
    refIndex: r.refIndex,
    item: r.item
  }))
  console.log(`  ${label} → query="${query}"  matches: ${hits.length}`)
  for (const h of hits) console.log(`    [${h.refIndex}] ${JSON.stringify(h.item)}`)
}

console.log('Direction A1 parity check — cross-separator fixture')
console.log('='.repeat(72))

// Fixture: a corpus with BOTH the concatenated form ("foobar") tokenized as
// one analyzer token AND the separated form ("foo bar") tokenized as two.
// A1 expansion of query "foobar" against this dictionary finds the exact
// "foobar" token, restricts to its postings, and DROPS the "foo bar" doc.
const docs = [
  { title: 'foobar' },           // tokenizes to ["foobar"]
  { title: 'foo bar' },          // tokenizes to ["foo", "bar"]
  { title: 'foo-bar baz' },      // tokenizes to ["foo", "bar", "baz"]
  { title: 'fizzbuzz quux' }     // unrelated control
]
const fuseToken = new Fuse(docs, {
  keys: ['title'],
  useTokenSearch: true,
  includeScore: true
})
const fuseDefault = new Fuse(docs, {
  keys: ['title'],
  includeScore: true
})

console.log('\nCorpus:')
for (let i = 0; i < docs.length; i++) console.log(`  [${i}] ${JSON.stringify(docs[i])}`)

console.log('\nBaseline behavior (what A1 must match):')
showHits('default fuzzy ', fuseDefault, 'foobar')
showHits('useTokenSearch', fuseToken,   'foobar')

console.log('\nStructural argument for A1 failure:')
console.log('  Baseline `useTokenSearch` runs `BitapSearch("foobar").searchIn(text)`')
console.log('  on EVERY record\'s field text. For doc [1] with text "foo bar", Bitap')
console.log('  matches "foobar" within distance budget (substituting one char to bridge')
console.log('  the separator).')
console.log()
console.log('  A1 expansion: walks `terms.keys()` and finds dict tokens within Bitap\'s')
console.log('  accept budget for "foobar". Dictionary contains: foobar, foo, bar, baz,')
console.log('  fizzbuzz, quux.')
console.log('    - "foobar" is exact → in expansion.')
console.log('    - "foo", "bar" (length 3) vs query (length 6): edit distance 3, well')
console.log('      outside default threshold; NOT in expansion.')
console.log('  Candidate doc set = postings of "foobar" = { doc 0 } only.')
console.log('  A1 then runs Bitap only on doc 0\'s text → MISSES doc 1 ("foo bar").')
console.log()
console.log('  This is a strict recall regression vs. baseline. A1 fails the')
console.log('  cross-separator parity gate. The plan\'s decision rule routes to')
console.log('  Direction B.')

// Simulate A1's restricted candidate set explicitly to make the regression
// auditable. We mark which baseline matches A1 would lose if it gated on the
// "foobar" exact-token expansion.
const baselineMatches = new Set(fuseToken.search('foobar').map((r) => r.refIndex))
const a1Candidate = new Set([0]) // postings of "foobar"
const dropped = [...baselineMatches].filter((i) => !a1Candidate.has(i))
console.log(`\nRecall regression: A1 candidate set drops ${dropped.length} match(es): ${JSON.stringify(dropped)}`)
console.log('='.repeat(72))
