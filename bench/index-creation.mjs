import Fuse from '../dist/fuse.mjs'

// Generate synthetic datasets of varying sizes
function generateDocs(count) {
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
  const words = ['hello', 'world', 'foo', 'bar', 'baz', 'quick', 'brown', 'fox', 'lazy', 'dog']
  const strings = new Array(count)
  for (let i = 0; i < count; i++) {
    const len = 3 + Math.floor(Math.random() * 8)
    let s = ''
    for (let j = 0; j < len; j++) {
      if (j > 0) s += ' '
      s += words[Math.floor(Math.random() * words.length)]
    }
    strings[i] = s
  }
  return strings
}

function bench(label, fn, warmup = 3, iterations = 10) {
  // Warmup
  for (let i = 0; i < warmup; i++) fn()

  // Timed runs
  const times = []
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    fn()
    times.push(performance.now() - start)
  }

  times.sort((a, b) => a - b)
  const median = times[Math.floor(times.length / 2)]
  const mean = times.reduce((a, b) => a + b, 0) / times.length
  const min = times[0]
  const max = times[times.length - 1]

  console.log(`  ${label}: median=${median.toFixed(2)}ms  mean=${mean.toFixed(2)}ms  min=${min.toFixed(2)}ms  max=${max.toFixed(2)}ms`)
  return median
}

// --- Object index creation ---
console.log('=== Object index creation (keys: title, body, tags) ===')
for (const size of [1_000, 10_000, 50_000, 100_000]) {
  const docs = generateDocs(size)
  const keys = ['title', 'body', 'tags']

  console.log(`\n${size.toLocaleString()} docs:`)
  bench('createIndex', () => {
    Fuse.createIndex(keys, docs)
  })
  bench('new Fuse()', () => {
    new Fuse(docs, { keys })
  })
  bench('new Fuse() + tokenSearch', () => {
    new Fuse(docs, { keys, useTokenSearch: true })
  })
}

// --- String list index creation ---
console.log('\n\n=== String list index creation ===')
for (const size of [1_000, 10_000, 50_000, 100_000]) {
  const strings = generateStrings(size)

  console.log(`\n${size.toLocaleString()} strings:`)
  bench('createIndex', () => {
    Fuse.createIndex([], strings)
  })
  bench('new Fuse()', () => {
    new Fuse(strings)
  })
}
