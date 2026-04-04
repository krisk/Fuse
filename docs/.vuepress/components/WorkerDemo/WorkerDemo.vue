<template>
  <div class="worker-demo">
    <div class="demo-config">
      <label>
        <span class="config-label">Dataset size</span>
        <select v-model.number="datasetSize" :disabled="running">
          <option :value="10000">10,000</option>
          <option :value="50000">50,000</option>
          <option :value="100000">100,000</option>
        </select>
      </label>
      <label>
        <span class="config-label">Workers</span>
        <select v-model.number="numWorkers" :disabled="running">
          <option :value="1">1</option>
          <option :value="2">2</option>
          <option :value="4">4</option>
          <option :value="8">8</option>
        </select>
      </label>
    </div>

    <div class="demo-arena">
      <div class="demo-column">
        <div class="column-header">
          <span class="column-title">Fuse</span>
          <span class="column-subtitle">single thread</span>
        </div>
        <div class="ball-track">
          <div class="ball" :style="{ transform: `translateX(${ballSingleX}px)` }"></div>
          <span class="fps-badge" :class="fpsClass">{{ fps }} fps</span>
        </div>
        <button
          class="run-btn"
          :class="{ active: runningSingle }"
          :disabled="running"
          @click="runSingle"
        >
          {{ runningSingle ? 'Searching...' : 'Search' }}
        </button>
        <div class="timing" v-if="singleTime !== null">
          {{ singleTime.total }}ms
          <span class="timing-note blocked">(UI blocked)</span>
          <div class="timing-detail">search only: {{ singleTime.search }}ms</div>
        </div>
        <div class="timing placeholder" v-else>&nbsp;</div>
      </div>

      <div class="demo-column">
        <div class="column-header">
          <span class="column-title">FuseWorker</span>
          <span class="column-subtitle">{{ numWorkers }} worker{{ numWorkers > 1 ? 's' : '' }}</span>
        </div>
        <div class="ball-track">
          <div class="ball worker-ball" :style="{ transform: `translateX(${ballWorkerX}px)` }"></div>
          <span class="fps-badge" :class="fpsClass">{{ fps }} fps</span>
        </div>
        <button
          class="run-btn worker-btn"
          :class="{ active: runningWorker }"
          :disabled="running"
          @click="runWorker"
        >
          {{ runningWorker ? 'Searching...' : 'Search' }}
        </button>
        <div class="timing" v-if="workerTime !== null">
          {{ workerTime.total }}ms
          <span class="timing-note speedup" v-if="singleTime !== null">
            ({{ speedup }}x faster, UI smooth)
          </span>
          <span class="timing-note" v-else>(UI smooth)</span>
          <div class="timing-detail">search only: {{ workerTime.search }}ms</div>
        </div>
        <div class="timing placeholder" v-else>&nbsp;</div>
      </div>
    </div>

    <div class="demo-query" v-if="singleTime !== null || workerTime !== null">
      Searched <strong>{{ datasetSize.toLocaleString() }}</strong> documents for
      <code>{{ QUERIES.join(', ') }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Fuse from '../../../../dist/fuse'

const QUERIES = ['john smith', 'quantum', 'xyz corp', 'engineering']

const FUSE_OPTIONS = {
  keys: ['name', 'email', 'company', 'description'],
  threshold: 0.4,
  includeScore: true
}

const firstNames = ['John','Jane','Alice','Bob','Charlie','Diana','Eve','Frank','Grace','Hank','Ivy','Jack','Karen','Leo','Mona','Nick','Olivia','Paul','Quinn','Rita','Sam','Tina','Uma','Victor']
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Anderson','Taylor','Thomas','Moore','Jackson','Martin','Lee','Perez','Thompson','White']
const companies = ['Acme Corp','Globex Inc','Initech','Umbrella Co','Stark Industries','Wayne Enterprises','XYZ Corp','Quantum Labs','Nova Systems','Apex Digital']
const domains = ['gmail.com','yahoo.com','outlook.com','company.com','work.org']
const words = ['engineering','marketing','sales','design','research','quantum','neural','cloud','data','analytics','platform','mobile','security','infrastructure','development','operations','strategy','innovation','optimization','integration','automation','visualization']

function pick(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)] }

function generateDataset(size: number) {
  const docs = []
  for (let i = 0; i < size; i++) {
    const first = pick(firstNames), last = pick(lastNames)
    const descLen = 5 + Math.floor(Math.random() * 10)
    docs.push({
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick(domains)}`,
      company: pick(companies),
      description: Array.from({ length: descLen }, () => pick(words)).join(' ')
    })
  }
  return docs
}

const datasetSize = ref(50000)
const numWorkers = ref(4)

watch([datasetSize, numWorkers], () => {
  singleTime.value = null
  workerTime.value = null
})
interface TimingResult {
  total: number
  search: number
}
const singleTime = ref<TimingResult | null>(null)
const workerTime = ref<TimingResult | null>(null)
const runningSingle = ref(false)
const runningWorker = ref(false)

const running = computed(() => runningSingle.value || runningWorker.value)
const speedup = computed(() => {
  if (singleTime.value && workerTime.value) {
    return (singleTime.value.total / workerTime.value.total).toFixed(1)
  }
  return null
})

// Ball animation + FPS tracking
const ballSingleX = ref(0)
const ballWorkerX = ref(0)
const fps = ref(60)
let singleDir = 1
let workerDir = 1
let animId: number | null = null
let frameCount = 0
let lastFpsTime = 0

const fpsClass = computed(() => {
  if (fps.value >= 50) return 'fps-good'
  if (fps.value >= 20) return 'fps-warn'
  return 'fps-bad'
})

function startAnimation() {
  if (animId) return
  lastFpsTime = performance.now()
  frameCount = 0

  function frame() {
    ballSingleX.value += singleDir * 3
    if (ballSingleX.value > 240) singleDir = -1
    if (ballSingleX.value < 0) singleDir = 1

    ballWorkerX.value += workerDir * 3
    if (ballWorkerX.value > 240) workerDir = -1
    if (ballWorkerX.value < 0) workerDir = 1

    frameCount++
    const now = performance.now()
    const elapsed = now - lastFpsTime
    if (elapsed >= 500) {
      fps.value = Math.round((frameCount / elapsed) * 1000)
      frameCount = 0
      lastFpsTime = now
    }

    animId = requestAnimationFrame(frame)
  }
  animId = requestAnimationFrame(frame)
}

function stopAnimation() {
  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }
}

onMounted(startAnimation)
onUnmounted(stopAnimation)

// Single-thread search
async function runSingle() {
  singleTime.value = null
  runningSingle.value = true

  await new Promise(r => setTimeout(r, 100))

  const docs = generateDataset(datasetSize.value)
  const totalStart = performance.now()
  const fuse = new Fuse(docs, FUSE_OPTIONS)
  const searchStart = performance.now()
  for (const q of QUERIES) fuse.search(q)
  const end = performance.now()
  singleTime.value = {
    total: Math.round(end - totalStart),
    search: Math.round(end - searchStart)
  }

  runningSingle.value = false
}

// Worker search
async function runWorker() {
  workerTime.value = null
  runningWorker.value = true

  await new Promise(r => setTimeout(r, 100))

  const docs = generateDataset(datasetSize.value)
  const n = numWorkers.value
  const totalStart = performance.now()
  const chunkSize = Math.ceil(docs.length / n)

  // Phase 1: Init workers (index creation)
  const workers: Worker[] = []
  const initPromises: Promise<void>[] = []

  for (let i = 0; i < n; i++) {
    const chunk = docs.slice(i * chunkSize, (i + 1) * chunkSize)
    const worker = new Worker(
      new URL('../../../../dist/fuse.worker.mjs', import.meta.url),
      { type: 'module' }
    )
    workers.push(worker)
    initPromises.push(new Promise((resolve, reject) => {
      worker.onerror = (e) => reject(e)
      worker.onmessage = () => resolve()
      worker.postMessage({ id: i, method: 'init', args: [chunk, FUSE_OPTIONS] })
    }))
  }

  await Promise.all(initPromises)

  // Phase 2: Search (timed separately)
  const searchStart = performance.now()
  const searchPromises: Promise<void>[] = []

  for (let i = 0; i < n; i++) {
    const worker = workers[i]
    searchPromises.push(new Promise((resolve) => {
      let searchDone = 0
      worker.onmessage = () => {
        searchDone++
        if (searchDone === QUERIES.length) {
          worker.terminate()
          resolve()
        }
      }
      for (let j = 0; j < QUERIES.length; j++) {
        worker.postMessage({ id: 100 + j, method: 'search', args: [QUERIES[j]] })
      }
    }))
  }

  await Promise.all(searchPromises)
  const end = performance.now()
  workerTime.value = {
    total: Math.round(end - totalStart),
    search: Math.round(end - searchStart)
  }

  runningWorker.value = false
}
</script>

<style scoped>
.worker-demo {
  margin: 1.5rem 0;
  padding: 1.5rem;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-bg-lighter);
}

.demo-config {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.demo-config label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.config-label {
  font-family: var(--font-family-code);
  color: var(--c-text-lighter);
}

.demo-config select {
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg);
  color: var(--c-text);
  font-size: 0.85rem;
}

.demo-arena {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .demo-arena {
    grid-template-columns: 1fr;
  }
}

.demo-column {
  text-align: center;
}

.column-header {
  margin-bottom: 0.75rem;
}

.column-title {
  font-weight: 700;
  font-size: 1.1rem;
  font-family: var(--font-family-code);
}

.column-subtitle {
  display: block;
  font-size: 0.8rem;
  color: var(--c-text-lighter);
  margin-top: 0.15rem;
}

.ball-track {
  height: 50px;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 5px;
}

.fps-badge {
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 0.65rem;
  font-family: var(--font-family-code);
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
  line-height: 1.4;
}

.fps-good {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.1);
}

.fps-warn {
  color: #ca8a04;
  background: rgba(202, 138, 4, 0.1);
}

.fps-bad {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

.ball {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #94a3b8;
  flex-shrink: 0;
}

.worker-ball {
  background: #2563eb;
}

.run-btn {
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: #94a3b8;
  color: white;
  border: none;
  border-radius: 6px;
  transition: background 0.15s;
}

.run-btn:hover:not(:disabled) {
  background: #64748b;
}

.run-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.run-btn.active {
  background: #ef4444;
}

.worker-btn {
  background: #2563eb;
}

.worker-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.worker-btn.active {
  background: #2563eb;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.timing {
  margin-top: 0.6rem;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: var(--font-family-code);
}

.timing.placeholder {
  visibility: hidden;
}

.timing-note {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--c-text-lighter);
}

.timing-detail {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--c-text-lightest);
  margin-top: 0.15rem;
}

.timing-note.blocked {
  color: #dc2626;
}

.timing-note.speedup {
  color: #16a34a;
}

.demo-query {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--c-text-lighter);
}

.demo-query code {
  font-size: 0.8rem;
}
</style>
