import Fuse from '../dist/fuse.mjs'

// --- Data generation ---
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

function median(arr) {
  const sorted = arr.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function bench(name, fn, iterations = 200) {
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

console.log('=== Extended Search — 10k books ===')
{
  const fuseExt = new Fuse(books, {
    keys: ['title', 'author.firstName'],
    useExtendedSearch: true
  })
  bench('Prefix match (^Book)', () => fuseExt.search('^Book'))
  bench('Exact match (=Author0)', () => fuseExt.search('=Author0'))
  bench('Combined (^Book !xyz)', () => fuseExt.search('^Book !xyz'))
}

console.log('\n=== Logical Search — 10k books ===')
{
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
}
