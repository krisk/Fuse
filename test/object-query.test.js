import Fuse from '../dist/fuse.mjs'
import * as ErrorMsg from '../src/core/errorMessages'

// Object ("MongoDB-style") query syntax.

const list = [
  { text: 'hello world' },
  { text: 'hello there' },
  { text: 'goodbye world' },
  { text: 'well hello' },
  { text: 'foo bar baz' },
  { text: 'hello' }
]

// Compare an object query against its equivalent string-syntax envelope, within
// the SAME logical envelope + key scope. Full result-object equality (score +
// matches/indices), not just order. String form needs useExtendedSearch to parse
// its operator characters; the object form does not, but sharing the flag keeps
// the comparison apples-to-apples.
function parity(strQuery, objQuery, extra = {}) {
  const opts = {
    keys: ['text'],
    useExtendedSearch: true,
    includeScore: true,
    includeMatches: true,
    ...extra
  }
  const fuse = new Fuse(list, opts)
  const objList = extra.list || list
  const f = extra.list ? new Fuse(objList, opts) : fuse
  const strResult = f.search(strQuery)
  const objResult = f.search(objQuery)
  expect(objResult).toEqual(strResult)
  return objResult
}

describe('Object query — parity with string syntax (keyed leaves)', () => {
  test('$eq === =term (exact)', () => {
    parity({ text: '=hello' }, { text: { $eq: 'hello' } })
  })

  test("$contains === 'term (include)", () => {
    parity({ text: "'ell" }, { text: { $contains: 'ell' } })
  })

  test('$startsWith === ^term (prefix)', () => {
    parity({ text: '^hel' }, { text: { $startsWith: 'hel' } })
  })

  test('$endsWith === term$ (suffix)', () => {
    parity({ text: 'llo$' }, { text: { $endsWith: 'llo' } })
  })

  test('$not $contains === !term (does not contain)', () => {
    parity({ text: '!world' }, { text: { $not: { $contains: 'world' } } })
  })

  test('$not $startsWith === !^term', () => {
    parity({ text: '!^hello' }, { text: { $not: { $startsWith: 'hello' } } })
  })

  test('$not $endsWith === !term$', () => {
    parity({ text: '!world$' }, { text: { $not: { $endsWith: 'world' } } })
  })

  test('$not alongside a positive operator ANDs', () => {
    // includes "hello" AND does not end with "world"
    parity(
      { text: "'hello !world$" },
      { text: { $contains: 'hello', $not: { $endsWith: 'world' } } }
    )
  })

  test('$fuzzy === term (fuzzy)', () => {
    parity({ text: 'hello' }, { text: { $fuzzy: 'hello' } })
  })

  test('multiple operators = AND (whitespace-AND string)', () => {
    // '^hel llo$'  ===  starts with "hel" AND ends with "llo"
    parity(
      { text: '^hel llo$' },
      { text: { $startsWith: 'hel', $endsWith: 'llo' } }
    )
  })

  test('field-local $or === string | (first matching OR group)', () => {
    parity(
      { text: '^goodbye | there$' },
      { text: { $or: [{ $startsWith: 'goodbye' }, { $endsWith: 'there' }] } }
    )
  })

  test('field-local $and === repeated fuzzy terms (old war)', () => {
    parity(
      { text: 'foo bar' },
      { text: { $and: [{ $fuzzy: 'foo' }, { $fuzzy: 'bar' }] } }
    )
  })

  test('field-local $or of $and (2-level OR-of-ANDs)', () => {
    parity(
      { text: "^hello world$ | 'bar" },
      {
        text: {
          $or: [
            { $startsWith: 'hello', $endsWith: 'world' },
            { $and: [{ $contains: 'bar' }] }
          ]
        }
      }
    )
  })
})

describe('Object query — normalization parity', () => {
  test('case-insensitive value is lowercased (default)', () => {
    parity({ text: '=HELLO' }, { text: { $eq: 'HELLO' } })
  })

  test('case-sensitive is respected', () => {
    parity(
      { text: '=hello' },
      { text: { $eq: 'hello' } },
      {
        isCaseSensitive: true
      }
    )
  })

  test('ignoreDiacritics strips accents on the value', () => {
    parity(
      { text: '^héllo' },
      { text: { $startsWith: 'héllo' } },
      {
        list: [{ text: 'hello world' }, { text: 'other' }],
        ignoreDiacritics: true
      }
    )
  })
})

describe('Object query — logical composition', () => {
  const books = [
    {
      title: "Old Man's War",
      author: { firstName: 'John', lastName: 'Scalzi' }
    },
    {
      title: 'The Lock Artist',
      author: { firstName: 'Steve', lastName: 'Hamilton' }
    },
    { title: 'HTML5', author: { firstName: 'Remy', lastName: 'Sharp' } }
  ]
  const opts = { keys: ['title', 'author.firstName', 'author.lastName'] }
  const idx = (r) => r.map((x) => x.refIndex).sort()

  test('implicit AND across fields', () => {
    const f = new Fuse(books, opts)
    const r = f.search({
      title: { $contains: 'a' },
      'author.lastName': { $startsWith: 'S' }
    })
    expect(idx(r)).toEqual([0]) // Old Man's War / Scalzi
  })

  test('top-level $or of object leaves', () => {
    const f = new Fuse(books, opts)
    const r = f.search({
      $or: [
        { title: { $startsWith: 'Old' } },
        { 'author.lastName': { $eq: 'Sharp' } }
      ]
    })
    expect(idx(r)).toEqual([0, 2])
  })

  test('deep nesting $or -> $and -> object leaves', () => {
    const f = new Fuse(books, opts)
    const r = f.search({
      $or: [
        {
          $and: [
            { title: { $contains: 'Man' } },
            { 'author.lastName': { $eq: 'Scalzi' } }
          ]
        },
        { 'author.firstName': { $startsWith: 'Rem' } }
      ]
    })
    expect(idx(r)).toEqual([0, 2])
  })

  test('$path leaf with object $val, nested in $and', () => {
    const f = new Fuse(books, opts)
    const r = f.search({
      $and: [{ $path: ['author', 'firstName'], $val: { $startsWith: 'John' } }]
    })
    expect(idx(r)).toEqual([0])
  })

  test('object and string leaves coexist in one tree', () => {
    const f = new Fuse(books, { ...opts, useExtendedSearch: true })
    const r = f.search({
      $or: [{ title: { $startsWith: 'Old' } }, { title: '^HTML' }]
    })
    expect(idx(r)).toEqual([0, 2])
  })
})

describe('Object query — includeMatches / arrays', () => {
  test('includeMatches indices match the string form', () => {
    parity({ text: "'ello" }, { text: { $contains: 'ello' } })
  })

  test('array-valued field', () => {
    const list2 = [
      { tags: ['fiction', 'classic'] },
      { tags: ['history', 'war'] },
      { tags: ['fiction', 'war'] }
    ]
    const f = new Fuse(list2, { keys: ['tags'] })
    const r = f.search({ tags: { $eq: 'war' } })
    expect(r.map((x) => x.refIndex).sort()).toEqual([1, 2])
  })
})

describe('Object query — grammar & error handling', () => {
  const f = () => new Fuse(list, { keys: ['text'] })

  test('unknown operator throws', () => {
    expect(() => f().search({ text: { $startWith: 'x' } })).toThrowError(
      ErrorMsg.UNKNOWN_QUERY_OPERATOR('$startWith')
    )
  })

  test('empty value throws (with key)', () => {
    expect(() => f().search({ text: { $startsWith: '' } })).toThrowError(
      ErrorMsg.EMPTY_QUERY_VALUE('$startsWith', 'text')
    )
  })

  test('non-string value throws', () => {
    expect(() => f().search({ text: { $startsWith: 42 } })).toThrowError(
      /must be a string/
    )
  })

  test('structural siblings (operator + $or) throw', () => {
    expect(() =>
      f().search({ text: { $startsWith: 'a', $or: [{ $eq: 'b' }] } })
    ).toThrowError(/cannot be mixed with \$and\/\$or/)
  })

  test('nested $and throws', () => {
    expect(() =>
      f().search({ text: { $and: [{ $and: [{ $eq: 'x' }] }] } })
    ).toThrowError(/\$and cannot be nested/)
  })

  test('nested $or throws', () => {
    expect(() =>
      f().search({ text: { $or: [{ $or: [{ $eq: 'x' }] }] } })
    ).toThrowError(/\$or cannot be nested/)
  })

  test('empty operator object throws', () => {
    expect(() => f().search({ text: {} })).toThrowError(/empty query/)
  })

  test('empty $and array throws', () => {
    expect(() => f().search({ text: { $and: [] } })).toThrowError(
      /\$and must be a non-empty array/
    )
  })

  test('diacritic-emptied value throws, does not hang', () => {
    // A lone combining mark normalizes to '' under ignoreDiacritics; the
    // post-normalization empty-check must reject it (would otherwise infinite-loop
    // the include matcher).
    const fx = new Fuse(list, { keys: ['text'], ignoreDiacritics: true })
    expect(() => fx.search({ text: { $contains: '́' } })).toThrowError(
      ErrorMsg.EMPTY_QUERY_VALUE('$contains', 'text')
    )
  })
})

describe('Object query — parseQuery auto:false', () => {
  test('object leaves retain fieldQuery, omit searcher; stay distinguishable', () => {
    const opts = { keys: ['text'], useExtendedSearch: true }
    const a = Fuse.parseQuery({ text: { $startsWith: 'a' } }, opts, {
      auto: false
    })
    const b = Fuse.parseQuery({ text: { $startsWith: 'b' } }, opts, {
      auto: false
    })
    // Distinct queries → distinct ASTs (would be indistinguishable if fieldQuery
    // were dropped).
    expect(a).not.toEqual(b)
    // No searcher built under auto:false.
    const leaf = a.children[0]
    expect(leaf.searcher).toBeUndefined()
    expect(leaf.fieldQuery).toEqual({ $startsWith: 'a' })
  })
})

// Full result-object parity (score + matches/indices) beyond the single-key
// list above — the multi-key and array cases the plan called out as where
// aggregation regressions could hide.
describe('Object query — full-result parity: multi-key & arrays', () => {
  const books = [
    { title: "Old Man's War", author: { first: 'John', last: 'Scalzi' } },
    { title: 'The Lock Artist', author: { first: 'Steve', last: 'Hamilton' } },
    { title: 'Artist Life', author: { first: 'Old', last: 'Scalzino' } },
    { title: 'HTML5', author: { first: 'Remy', last: 'Sharp' } }
  ]
  const opts = {
    keys: ['title', 'author.first', 'author.last'],
    useExtendedSearch: true,
    includeScore: true,
    includeMatches: true
  }
  const fullParity = (strQuery, objQuery) => {
    const f = new Fuse(books, opts)
    expect(f.search(objQuery)).toEqual(f.search(strQuery))
  }

  test('keyed leaf on a multi-key index — prefix', () => {
    fullParity({ title: '^Old' }, { title: { $startsWith: 'Old' } })
  })

  test('keyed leaf on a non-title key of a multi-key index', () => {
    fullParity(
      { 'author.last': '^Scalz' },
      { 'author.last': { $startsWith: 'Scalz' } }
    )
  })

  test('inverse operator on multi-key — full parity', () => {
    fullParity(
      { title: '!Artist' },
      { title: { $not: { $contains: 'Artist' } } }
    )
  })

  test('array-valued field — full parity incl. matches/indices', () => {
    const list2 = [
      { tags: ['fiction', 'classic war'] },
      { tags: ['history', 'war stories'] },
      { tags: ['war', 'fiction'] }
    ]
    const o = {
      keys: ['tags'],
      useExtendedSearch: true,
      includeScore: true,
      includeMatches: true
    }
    const f = new Fuse(list2, o)
    expect(f.search({ tags: { $contains: 'war' } })).toEqual(
      f.search({ tags: "'war" })
    )
  })
})

describe('Object query — remaining grammar/regression cases', () => {
  const f = () => new Fuse(list, { keys: ['text'] })

  test('empty $or array throws', () => {
    expect(() => f().search({ text: { $or: [] } })).toThrowError(
      /\$or must be a non-empty array/
    )
  })

  test('$or inside $and throws', () => {
    expect(() =>
      f().search({ text: { $and: [{ $or: [{ $eq: 'x' }] }] } })
    ).toThrowError(/\$or cannot be nested/)
  })

  test('$and clause with operator sibling inside $or throws', () => {
    expect(() =>
      f().search({ text: { $or: [{ $and: [{ $eq: 'x' }], $eq: 'y' }] } })
    ).toThrowError(
      /cannot be mixed with \$and\/\$or|\$and cannot have siblings/
    )
  })

  test('standalone top-level $path with object $val throws (pre-existing)', () => {
    // Scoped out: the outer convertToExplicit splits $path/$val before
    // the isPath check, so a standalone $path leaf throws — for string $val too.
    const fx = new Fuse(list, { keys: ['text'], useExtendedSearch: true })
    expect(() =>
      fx.search({ $path: ['text'], $val: { $startsWith: 'hello' } })
    ).toThrow()
  })

  test('$not with multiple operators throws (De Morgan ambiguity)', () => {
    expect(() =>
      f().search({ text: { $not: { $contains: 'a', $endsWith: 'b' } } })
    ).toThrowError(/\$not must wrap exactly one operator/)
  })

  test('$not with an empty object throws', () => {
    expect(() => f().search({ text: { $not: {} } })).toThrowError(
      /\$not must wrap exactly one operator/
    )
  })

  test('$not with a non-object throws', () => {
    expect(() => f().search({ text: { $not: 'world' } })).toThrowError(
      /\$not must wrap an operator object/
    )
  })

  test('nested $not throws', () => {
    expect(() =>
      f().search({ text: { $not: { $not: { $contains: 'a' } } } })
    ).toThrowError(/\$not cannot be nested/)
  })

  test('$not $fuzzy throws (no inverse-fuzzy matcher)', () => {
    expect(() =>
      f().search({ text: { $not: { $fuzzy: 'hello' } } })
    ).toThrowError(/'\$fuzzy' cannot be negated/)
  })

  test('$not $eq throws (whole-string inequality unimplemented)', () => {
    expect(() => f().search({ text: { $not: { $eq: 'hello' } } })).toThrowError(
      /'\$eq' cannot be negated/
    )
  })

  test('$not with an unknown inner operator throws', () => {
    expect(() => f().search({ text: { $not: { $bogus: 'x' } } })).toThrowError(
      ErrorMsg.UNKNOWN_QUERY_OPERATOR('$bogus')
    )
  })

  test('$not with $and inside throws', () => {
    expect(() =>
      f().search({ text: { $not: { $and: [{ $contains: 'a' }] } } })
    ).toThrowError(/\$and cannot be used inside \$not/)
  })

  test('$not empty value reports the wrapped operator', () => {
    expect(() =>
      f().search({ text: { $not: { $contains: '' } } })
    ).toThrowError(ErrorMsg.EMPTY_QUERY_VALUE('$contains', 'text'))
  })

  test('retired $notContains is now an unknown operator', () => {
    expect(() => f().search({ text: { $notContains: 'world' } })).toThrowError(
      ErrorMsg.UNKNOWN_QUERY_OPERATOR('$notContains')
    )
  })

  test('valid operator alongside an unknown key throws at runtime', () => {
    // The type can not reject an unknown key on a predeclared variable (structural
    // typing), so the runtime guard is the backstop.
    expect(() =>
      f().search({ text: { $eq: 'hello', $bogus: 'x' } })
    ).toThrowError(ErrorMsg.UNKNOWN_QUERY_OPERATOR('$bogus'))
  })
})

describe('Object query — include matcher empty-pattern guard', () => {
  test('empty include pattern returns no-match, does not hang', async () => {
    // Direct check of the defense-in-depth guard: constructing the include
    // matcher with an empty pattern must not infinite-loop.
    const { default: matchers } =
      await import('../src/search/extended/matchers')
    const include = matchers.find((m) => m.type === 'include')
    const result = include.create('').search('anything at all')
    expect(result.isMatch).toBe(false)
  })
})

describe('Object query — build gating', () => {
  test('basic bundle contains no matcher/compiler bodies', async () => {
    const { readFileSync } = await import('node:fs')
    const { fileURLToPath } = await import('node:url')
    const { dirname, join } = await import('node:path')
    const root = join(dirname(fileURLToPath(import.meta.url)), '..')
    for (const file of [
      'dist/fuse.basic.mjs',
      'dist/fuse.basic.min.mjs',
      'dist/fuse.basic.cjs',
      'dist/fuse.basic.min.cjs'
    ]) {
      const src = readFileSync(join(root, file), 'utf8')
      expect(src).not.toMatch(/multiRegex|prefix-exact|OPERATOR_TO_TYPE/)
    }
  })
})
