<template>
  <div class="arch-diagram">
    <div class="arch-column">
      <div class="arch-label">Fuse.js</div>
      <div class="arch-flow">
        <div class="arch-node browser-node" :class="{ active: fuseStep >= 1 }">
          <span class="node-icon">🖥</span>
          <span class="node-text">Browser</span>
        </div>
        <div class="arch-arrow" :class="{ active: fuseStep >= 2 }">
          <svg width="24" height="40" viewBox="0 0 24 40">
            <line x1="12" y1="0" x2="12" y2="30" stroke="currentColor" stroke-width="2" />
            <polygon points="6,28 12,38 18,28" fill="currentColor" />
          </svg>
          <span class="arrow-label">&lt; 1ms</span>
        </div>
        <div class="arch-node result-node" :class="{ active: fuseStep >= 3 }">
          <span class="node-icon">✓</span>
          <span class="node-text">Results</span>
        </div>
      </div>
      <button class="arch-play" @click="playFuse" :disabled="fuseRunning">
        {{ fuseRunning ? 'Running…' : 'Run' }}
      </button>
    </div>

    <div class="arch-divider"></div>

    <div class="arch-column">
      <div class="arch-label">Semantic search</div>
      <div class="arch-flow">
        <div class="arch-node browser-node" :class="{ active: vectorStep >= 1 }">
          <span class="node-icon">🖥</span>
          <span class="node-text">Browser</span>
        </div>
        <div class="arch-arrow" :class="{ active: vectorStep >= 2 }">
          <svg width="24" height="40" viewBox="0 0 24 40">
            <line x1="12" y1="0" x2="12" y2="30" stroke="currentColor" stroke-width="2" />
            <polygon points="6,28 12,38 18,28" fill="currentColor" />
          </svg>
          <span class="arrow-label">~20ms</span>
        </div>
        <div class="arch-node api-node" :class="{ active: vectorStep >= 3 }">
          <span class="node-icon">⬡</span>
          <span class="node-text">API server</span>
        </div>
        <div class="arch-arrow" :class="{ active: vectorStep >= 4 }">
          <svg width="24" height="40" viewBox="0 0 24 40">
            <line x1="12" y1="0" x2="12" y2="30" stroke="currentColor" stroke-width="2" />
            <polygon points="6,28 12,38 18,28" fill="currentColor" />
          </svg>
          <span class="arrow-label">~50ms</span>
        </div>
        <div class="arch-node embed-node" :class="{ active: vectorStep >= 5 }">
          <span class="node-icon">🧠</span>
          <span class="node-text">Embedding model</span>
        </div>
        <div class="arch-arrow" :class="{ active: vectorStep >= 6 }">
          <svg width="24" height="40" viewBox="0 0 24 40">
            <line x1="12" y1="0" x2="12" y2="30" stroke="currentColor" stroke-width="2" />
            <polygon points="6,28 12,38 18,28" fill="currentColor" />
          </svg>
          <span class="arrow-label">~30ms</span>
        </div>
        <div class="arch-node db-node" :class="{ active: vectorStep >= 7 }">
          <span class="node-icon">⛁</span>
          <span class="node-text">Vector DB</span>
        </div>
        <div class="arch-arrow" :class="{ active: vectorStep >= 8 }">
          <svg width="24" height="40" viewBox="0 0 24 40">
            <line x1="12" y1="0" x2="12" y2="30" stroke="currentColor" stroke-width="2" />
            <polygon points="6,28 12,38 18,28" fill="currentColor" />
          </svg>
          <span class="arrow-label">~20ms</span>
        </div>
        <div class="arch-node result-node" :class="{ active: vectorStep >= 9 }">
          <span class="node-icon">✓</span>
          <span class="node-text">Results</span>
        </div>
      </div>
      <button class="arch-play" @click="playVector" :disabled="vectorRunning">
        {{ vectorRunning ? 'Running…' : 'Run' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fuseStep = ref(0)
const vectorStep = ref(0)
const fuseRunning = ref(false)
const vectorRunning = ref(false)

async function playFuse() {
  fuseRunning.value = true
  fuseStep.value = 0

  await wait(300)
  fuseStep.value = 1 // browser lights up
  await wait(200)
  fuseStep.value = 2 // arrow
  await wait(150)
  fuseStep.value = 3 // results

  fuseRunning.value = false
}

async function playVector() {
  vectorRunning.value = true
  vectorStep.value = 0

  await wait(300)
  vectorStep.value = 1 // browser
  await wait(200)
  vectorStep.value = 2 // arrow to API
  await wait(300)
  vectorStep.value = 3 // API
  await wait(200)
  vectorStep.value = 4 // arrow to embed
  await wait(400)
  vectorStep.value = 5 // embed model
  await wait(200)
  vectorStep.value = 6 // arrow to DB
  await wait(300)
  vectorStep.value = 7 // vector DB
  await wait(200)
  vectorStep.value = 8 // arrow to results
  await wait(300)
  vectorStep.value = 9 // results

  vectorRunning.value = false
}

function wait(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}
</script>

<style scoped>
.arch-diagram {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
  padding: 1.5rem;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-bg-lighter);
}

@media (max-width: 640px) {
  .arch-diagram {
    grid-template-columns: 1fr;
  }
  .arch-divider {
    width: 100%;
    height: 1px;
    border-left: none;
    border-top: 1px dashed var(--c-border);
  }
}

.arch-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.arch-label {
  font-weight: 700;
  font-size: 1rem;
  font-family: var(--font-family-code);
  margin-bottom: 1rem;
}

.arch-divider {
  border-left: 1px dashed var(--c-border);
  min-height: 100%;
}

.arch-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  min-height: 380px;
}

.arch-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-bg);
  font-size: 0.85rem;
  font-family: var(--font-family-code);
  color: var(--c-text-lighter);
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
}

.arch-node.active {
  border-color: var(--c-brand);
  color: var(--c-text);
  box-shadow: 0 0 0 3px rgba(var(--c-brand-rgb, 62, 175, 124), 0.15);
}

.node-icon {
  font-size: 1rem;
}

.node-text {
  white-space: nowrap;
}

.arch-arrow {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--c-border);
  transition: color 0.3s ease;
}

.arch-arrow.active {
  color: var(--c-brand);
}

.arrow-label {
  font-size: 0.7rem;
  font-family: var(--font-family-code);
  color: var(--c-text-lightest);
  white-space: nowrap;
}

.arch-arrow.active .arrow-label {
  color: var(--c-text-lighter);
}

.arch-play {
  margin-top: 1rem;
  padding: 0.4rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: var(--c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  transition: opacity 0.15s;
}

.arch-play:hover:not(:disabled) {
  opacity: 0.85;
}

.arch-play:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-node.active {
  border-color: #16a34a;
  background: rgba(22, 163, 74, 0.05);
}

.api-node.active {
  border-color: #2563eb;
}

.embed-node.active {
  border-color: #7c3aed;
}

.db-node.active {
  border-color: #ea580c;
}
</style>
