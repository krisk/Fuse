import Fuse from '../../dist/fuse.min.mjs'

self.onmessage = (e) => {
  const { id, docs, options, queries } = e.data

  const fuse = new Fuse(docs, options)

  const results = {}
  for (const q of queries) {
    results[q] = fuse.search(q)
  }

  self.postMessage({ id, results })
}
