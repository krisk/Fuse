import Fuse from '../dist/fuse.mjs'

// --- Data generation ---
const words = [
  'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape',
  'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya',
  'quince', 'raspberry', 'strawberry', 'tangerine', 'watermelon', 'blueberry',
  'algorithm', 'database', 'framework', 'javascript', 'typescript', 'performance',
  'optimization', 'indexing', 'searching', 'matching', 'fuzzy', 'token'
]

function randomWords(min, max) {
  const len = min + Math.floor(Math.random() * (max - min + 1))
  let result = ''
  for (let i = 0; i < len; i++) {
    if (i > 0) result += ' '
    result += words[Math.floor(Math.random() * words.length)]
  }
  return result
}

function generateDocs(count) {
  const docs = new Array(count)
  for (let i = 0; i < count; i++) {
    docs[i] = {
      title: randomWords(2, 6),
      body: randomWords(10, 50),
      tags: [randomWords(1, 2), randomWords(1, 2), randomWords(1, 2)]
    }
  }
  return docs
}

function generateStrings(count) {
  const w = ['hello', 'world', 'foo', 'bar', 'baz', 'quick', 'brown', 'fox', 'lazy', 'dog']
  const strings = new Array(count)
  for (let i = 0; i < count; i++) {
    const len = 3 + Math.floor(Math.random() * 8)
    let s = ''
    for (let j = 0; j < len; j++) {
      if (j > 0) s += ' '
      s += w[Math.floor(Math.random() * w.length)]
    }
    strings[i] = s
  }
  return strings
}

function bench(label, fn, warmup = 3, iterations = 10) {
  for (let i = 0; i < warmup; i++) fn()

  const times = []
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    fn()
    times.push(performance.now() - start)
  }

  times.sort((a, b) => a - b)
  const median = times[Math.floor(times.length / 2)]
  const min = times[0]
  const max = times[times.length - 1]

  console.log(`  ${label}: median=${median.toFixed(2)}ms  min=${min.toFixed(2)}ms  max=${max.toFixed(2)}ms`)
  return median
}

// --- Object search (10k docs, main benchmark) ---
console.log('=== Object search — 10k docs (keys: title, body, tags) ===')
{
  const docs = generateDocs(10_000)
  const keys = ['title', 'body', 'tags']
  const fuse = new Fuse(docs, { keys, includeScore: true })
  const fuseMatch = new Fuse(docs, { keys, includeScore: true, includeMatches: true })
  const fuseToken = new Fuse(docs, { keys, includeScore: true, useTokenSearch: true })

  bench('fuzzy "apple"', () => fuse.search('apple'))
  bench('fuzzy "javascrpt"', () => fuse.search('javascrpt'))
  bench('fuzzy "apple" +matches', () => fuseMatch.search('apple'))
  bench('fuzzy "apple" limit=10', () => fuse.search('apple', { limit: 10 }))
  console.log('  ---')
  bench('token "apple"', () => fuseToken.search('apple'))
  bench('token "javascrpt"', () => fuseToken.search('javascrpt'))
  bench('token "javascript optimization"', () => fuseToken.search('javascript optimization'))
}

// --- String list search ---
console.log('\n=== String list search — 10k strings ===')
{
  const strings = generateStrings(10_000)
  const fuse = new Fuse(strings, { includeScore: true })

  bench('fuzzy "quick"', () => fuse.search('quick'))
  bench('fuzzy "brwn"', () => fuse.search('brwn'))
}

// --- Scaling check ---
console.log('\n=== Scaling — fuzzy "apple" ===')
for (const size of [1_000, 10_000, 50_000]) {
  const docs = generateDocs(size)
  const fuse = new Fuse(docs, { keys: ['title', 'body', 'tags'], includeScore: true })
  bench(`${size.toLocaleString()} docs`, () => fuse.search('apple'))
}

// --- remove() ---
console.log('\n=== remove() — 10k docs, remove 1k ===')
{
  const docs = generateDocs(10_000)
  const keys = ['title', 'body', 'tags']

  bench('remove 1k from 10k', () => {
    const fuse = new Fuse([...docs], { keys })
    let removed = 0
    fuse.remove(() => {
      if (removed < 1000) { removed++; return true }
      return false
    })
  }, 2, 5)
}
