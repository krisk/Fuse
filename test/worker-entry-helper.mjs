// Runs the REAL built worker script (dist/fuse.worker.mjs) inside a Node
// worker_threads worker by bridging the webworker `self` API to `parentPort`.
// Unlike worker-thread-helper.mjs (which imports dist/fuse.mjs and constructs
// Fuse directly), this exercises src/workers/worker.ts's OWN plugin registration
// — including registerObjectCompiler — through the actual init/search message
// protocol. Removing that registration would make the object-query search below
// throw, failing the test.
import { parentPort, workerData } from 'node:worker_threads'

const pending = new Map()
let nextId = 0

// Fake webworker global. postMessage routes the worker script's replies back to
// the caller's pending promises (set up before import so worker.ts's top-level
// `self.onmessage = …` lands on this object).
globalThis.self = {
  onmessage: null,
  postMessage(msg) {
    const p = pending.get(msg.id)
    if (!p) return
    pending.delete(msg.id)
    if (msg.error) p.reject(new Error(msg.error))
    else p.resolve(msg.result)
  }
}

await import('../dist/fuse.worker.mjs') // sets self.onmessage

function call(method, args) {
  return new Promise((resolve, reject) => {
    const id = nextId++
    pending.set(id, { resolve, reject })
    // The worker handler is synchronous; it replies via self.postMessage.
    self.onmessage({ data: { id, method, args } })
  })
}

const { docs, options, query } = workerData

await call('init', [docs, options])
const results = await call('search', [query])
parentPort.postMessage(results)
