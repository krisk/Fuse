<template>
  <div class="perf-demo">
    <div class="perf-config">
      <label>
        <span class="config-label">Documents</span>
        <select v-model.number="listSize" :disabled="running">
          <option :value="1000">1,000</option>
          <option :value="10000">10,000</option>
          <option :value="50000">50,000</option>
          <option :value="100000">100,000</option>
        </select>
      </label>
      <label>
        <span class="config-label">Keys</span>
        <select v-model.number="keyCount" :disabled="running">
          <option :value="1">1</option>
          <option :value="2">2</option>
          <option :value="3">3</option>
          <option :value="4">4</option>
        </select>
      </label>
      <label>
        <span class="config-label">Query</span>
        <input
          type="text"
          class="query-input"
          v-model="query"
          :disabled="running"
          placeholder="javascript"
        />
      </label>
    </div>

    <div class="perf-run-row">
      <button class="perf-btn" :disabled="running" @click="runBenchmark">
        {{ running ? 'Running...' : 'Run on your machine' }}
      </button>
      <div class="perf-note" v-if="!results">Runs search {{ SEARCH_RUNS }} times and shows the average.</div>
    </div>

    <div class="perf-results" v-if="results">
      <div class="result-card">
        <div class="result-value">{{ results.indexTime }}</div>
        <div class="result-label">Index creation</div>
      </div>
      <div class="result-card">
        <div class="result-value">{{ results.searchTime }}</div>
        <div class="result-label">Search (avg over {{ SEARCH_RUNS }} runs)</div>
      </div>
      <div class="result-card">
        <div class="result-value">{{ results.matchCount }}</div>
        <div class="result-label">Matches found</div>
      </div>
    </div>

    <div class="perf-meta" v-if="results">
      <sub>{{ listSize.toLocaleString() }} docs, {{ keyCount }} key{{ keyCount > 1 ? 's' : '' }}, query "{{ results.query }}" — measured in your browser via Web Worker</sub>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const SEARCH_RUNS = 50

const ALL_KEYS = ['title', 'description', 'category', 'tags']

const listSize = ref(10000)
const keyCount = ref(2)
const query = ref('javascript')

watch([listSize, keyCount, query], () => {
  results.value = null
})
const running = ref(false)
const results = ref<{ indexTime: string; searchTime: string; matchCount: number; query: string } | null>(null)

async function runBenchmark() {
  running.value = true
  results.value = null

  const keys = ALL_KEYS.slice(0, keyCount.value)
  const q = query.value || 'javascript'

  await new Promise(r => setTimeout(r, 50))

  const worker = new Worker(
    new URL('../../../../dist/fuse.worker.mjs', import.meta.url),
    { type: 'module' }
  )

  const workerResults = await new Promise<{ indexTime: number; searchTime: number; matchCount: number }>((resolve, reject) => {
    let msgCount = 0

    worker.onerror = (e) => {
      worker.terminate()
      reject(e)
    }

    // Step 1: Generate data and measure index creation
    // We send a large dataset via init and time the round-trip
    const words = ['alpha','bravo','charlie','delta','echo','foxtrot',
      'golf','hotel','india','juliet','kilo','lima','mike','november',
      'oscar','papa','quebec','romeo','sierra','tango','uniform',
      'victor','whiskey','xray','yankee','zulu','javascript','typescript',
      'python','rust','golang','swift','kotlin','scala','elixir']

    function randomSentence(len: number) {
      return Array.from({ length: len }, () =>
        words[Math.floor(Math.random() * words.length)]
      ).join(' ')
    }

    const docs = []
    for (let i = 0; i < listSize.value; i++) {
      const doc: any = {}
      if (keys.includes('title')) doc.title = randomSentence(4)
      if (keys.includes('description')) doc.description = randomSentence(12)
      if (keys.includes('category')) doc.category = randomSentence(2)
      if (keys.includes('tags')) doc.tags = randomSentence(6)
      docs.push(doc)
    }

    const options = { keys, threshold: 0.4, includeScore: true }

    // We'll use a custom protocol: send 'benchmark' messages
    // But we only have init/search, so we measure differently:
    // - Time the init (includes index creation)
    // - Time multiple searches

    const initStart = performance.now()

    worker.onmessage = () => {
      msgCount++

      if (msgCount === 1) {
        // Init done
        const indexTime = performance.now() - initStart

        // Now run searches
        const searchStart = performance.now()
        let searchDone = 0

        worker.onmessage = (e) => {
          searchDone++
          if (searchDone === SEARCH_RUNS) {
            const searchTime = (performance.now() - searchStart) / SEARCH_RUNS
            const matchCount = e.data.result.length

            worker.terminate()
            resolve({ indexTime, searchTime, matchCount })
          }
        }

        for (let i = 0; i < SEARCH_RUNS; i++) {
          worker.postMessage({ id: 10 + i, method: 'search', args: [q] })
        }
      }
    }

    worker.postMessage({ id: 0, method: 'init', args: [docs, options] })
  })

  results.value = {
    indexTime: formatTime(workerResults.indexTime),
    searchTime: formatTime(workerResults.searchTime),
    matchCount: workerResults.matchCount,
    query: q
  }

  running.value = false
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`
  if (ms < 10) return `${ms.toFixed(2)}ms`
  return `${ms.toFixed(1)}ms`
}
</script>

<style scoped>
.perf-demo {
  margin: 1.5rem 0;
  padding: 1.5rem;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-bg-lighter);
}

.perf-config {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  margin-bottom: 1.25rem;
}

.perf-config label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.config-label {
  font-family: var(--font-family-code);
  color: var(--c-text-lighter);
}

.perf-config select,
.query-input {
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg);
  color: var(--c-text);
  font-size: 0.85rem;
  font-family: var(--font-family-code);
}

.query-input {
  width: 120px;
}

.perf-run-row {
  text-align: center;
  margin-bottom: 1.25rem;
}

.perf-btn {
  padding: 0.5rem 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: var(--c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  transition: opacity 0.15s;
}

.perf-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.perf-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.perf-note {
  font-size: 0.75rem;
  color: var(--c-text-lightest);
  margin-top: 0.5rem;
}

.perf-results {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 640px) {
  .perf-results {
    grid-template-columns: 1fr;
  }
}

.result-card {
  text-align: center;
  padding: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-bg);
}

.result-value {
  font-size: 1.4rem;
  font-weight: 700;
  font-family: var(--font-family-code);
  color: var(--c-brand);
}

.result-label {
  font-size: 0.75rem;
  color: var(--c-text-lighter);
  margin-top: 0.25rem;
}

.perf-meta {
  text-align: center;
  color: var(--c-text-lightest);
}
</style>
