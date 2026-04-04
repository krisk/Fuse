import Fuse from '../dist/fuse.mjs'

// Generate test data
const books = []
for (let i = 0; i < 10000; i++) {
  books.push({
    title: `Book Title ${i} ${Math.random().toString(36).slice(2)}`,
    author: {
      firstName: `Author${i}`,
      lastName: `Last${Math.random().toString(36).slice(2)}`
    },
    tags: [`tag${i % 50}`, `category${i % 20}`, `genre${i % 10}`]
  })
}

const stringList = books.map(b => b.title)

function median(arr) {
  const sorted = arr.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function bench(name, fn, iterations = 200) {
  // Warmup
  for (let i = 0; i < 10; i++) fn()

  const times = []
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    fn()
    times.push(performance.now() - start)
  }
  const med = median(times)
  const min = Math.min(...times)
  console.log(`  ${name}: median=${med.toFixed(3)}ms  min=${min.toFixed(3)}ms`)
  return med
}

console.log('Fuse.js Benchmark')
console.log('=================')
console.log(`Dataset: ${books.length} records\n`)

// 1. Index creation
console.log('Index Creation:')
bench('Object list (3 keys)', () => {
  new Fuse(books, { keys: ['title', 'author.firstName', 'author.lastName'] })
})
bench('String list', () => {
  new Fuse(stringList)
})

// 2. Fuzzy search
console.log('\nFuzzy Search:')
const fuseObj = new Fuse(books, {
  keys: ['title', 'author.firstName', 'author.lastName'],
  includeScore: true,
  includeMatches: true
})
const fuseStr = new Fuse(stringList, {
  includeScore: true,
  includeMatches: true
})

bench('Object search (short query)', () => fuseObj.search('boo'))
bench('Object search (medium query)', () => fuseObj.search('book title'))
bench('Object search (long query)', () => fuseObj.search('book title author'))
bench('String search (short query)', () => fuseStr.search('boo'))
bench('String search (medium query)', () => fuseStr.search('book title'))

// 3. Search with limit (heap path)
console.log('\nSearch with Limit (heap):')
bench('Object search limit=10', () => fuseObj.search('book', { limit: 10 }))
bench('Object search limit=100', () => fuseObj.search('book', { limit: 100 }))
bench('String search limit=10', () => fuseStr.search('book', { limit: 10 }))

// 4. Extended search
console.log('\nExtended Search:')
const fuseExt = new Fuse(books, {
  keys: ['title', 'author.firstName'],
  useExtendedSearch: true
})
bench("Prefix match (^Book)", () => fuseExt.search('^Book'))
bench("Exact match (=Author0)", () => fuseExt.search('=Author0'))
bench("Combined (^Book !xyz)", () => fuseExt.search('^Book !xyz'))

// 5. Logical search
console.log('\nLogical Search:')
const fuseLogi = new Fuse(books, {
  keys: ['title', 'author.firstName', 'tags'],
  useExtendedSearch: true
})
bench('$and query', () => fuseLogi.search({
  $and: [{ title: 'book' }, { 'author.firstName': 'Author1' }]
}))
bench('$or query', () => fuseLogi.search({
  $or: [{ title: 'book' }, { tags: 'tag1' }]
}))

console.log('\nDone.')
