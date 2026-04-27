<template>
  <div class="threshold-demo">
    <div class="demo-controls">
      <label>
        <span class="control-label">Query</span>
        <input type="text" v-model="query" placeholder="javscript" />
      </label>
    </div>

    <div class="slider-row">
      <span class="slider-label">threshold</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        v-model.number="threshold"
        class="slider"
      />
      <span class="slider-value">{{ threshold.toFixed(2) }}</span>
    </div>

    <div class="slider-hint">
      <span>0.0 — exact only</span>
      <span>1.0 — match anything</span>
    </div>

    <div class="results" v-if="query">
      <div class="results-header">
        <span>{{ passCount }} of {{ allResults.length }} results pass threshold</span>
      </div>
      <div
        v-for="(r, i) in allResults"
        :key="i"
        class="result-row"
        :class="{ pass: r.score <= threshold, fail: r.score > threshold }"
      >
        <span class="result-item">{{ r.item }}</span>
        <span class="result-score" :class="{ 'score-zero': r.score === 0 }">
          {{ r.score === 0 ? 'perfect' : r.score.toFixed(3) }}
        </span>
        <span class="result-bar">
          <span class="bar-fill" :style="{ width: (1 - r.score) * 100 + '%' }"></span>
          <span class="threshold-line" :style="{ left: (1 - threshold) * 100 + '%' }"></span>
        </span>
      </div>
    </div>

    <div class="no-query" v-else>
      Type a query to see results ranked by fuzziness score.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Fuse from '../../../../dist/fuse'

const items = [
  'JavaScript',
  'TypeScript',
  'Java',
  'JSON',
  'Jest',
  'jQuery',
  'JSX',
  'Jasmine',
  'Python',
  'React',
]

const query = ref('javscript')
const threshold = ref(0.6)

const fuse = new Fuse(items, {
  includeScore: true,
  threshold: 1.0, // get all results, we'll filter by threshold in the UI
  ignoreLocation: true,
})

const allResults = computed(() => {
  if (!query.value) return []
  return fuse.search(query.value).map(r => ({
    item: r.item,
    score: r.score ?? 1,
  }))
})

const passCount = computed(() => {
  return allResults.value.filter(r => r.score <= threshold.value).length
})
</script>

<style scoped lang="css">
.threshold-demo {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background: var(--c-bg);
}

.demo-controls {
  margin-bottom: 16px;
}

.demo-controls label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-lighter);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.demo-controls input[type="text"] {
  padding: 6px 10px;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-size: 14px;
  font-family: var(--font-family-code);
  background: var(--c-bg);
  color: var(--c-text);
  width: 200px;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.slider-label {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-family-code);
  color: var(--c-text-lighter);
  width: 80px;
  flex-shrink: 0;
}

.slider {
  flex: 1;
  max-width: 300px;
  accent-color: var(--c-brand);
}

.slider-value {
  font-family: var(--font-family-code);
  font-size: 14px;
  font-weight: 700;
  color: var(--c-text);
  width: 40px;
}

.slider-hint {
  display: flex;
  justify-content: space-between;
  max-width: 392px;
  padding-left: 92px;
  font-size: 11px;
  color: var(--c-text-lightest, #aaa);
  margin-bottom: 16px;
}

.results-header {
  font-size: 13px;
  color: var(--c-text-lighter);
  margin-bottom: 8px;
  font-weight: 600;
}

.result-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  margin-bottom: 2px;
  transition: opacity 0.2s, background-color 0.2s;
}

.result-row.pass {
  background: var(--c-bg);
}

.result-row.fail {
  opacity: 0.35;
}

.result-item {
  font-size: 14px;
  font-weight: 500;
  width: 120px;
  flex-shrink: 0;
}

.result-score {
  font-family: var(--font-family-code);
  font-size: 12px;
  color: var(--c-text-lighter);
  width: 50px;
  flex-shrink: 0;
  text-align: right;
}

.result-score.score-zero {
  color: #155724;
  font-weight: 600;
}

.dark .result-score.score-zero {
  color: #75d49b;
}

.result-bar {
  flex: 1;
  max-width: 200px;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  position: relative;
  overflow: visible;
}

.dark .result-bar {
  background: #2a2a2a;
}

.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #d4edda;
  border-radius: 4px;
  transition: width 0.2s;
}

.dark .bar-fill {
  background: #1a3a2a;
}

.result-row.fail .bar-fill {
  background: #f8d7da;
}

.dark .result-row.fail .bar-fill {
  background: #3a1a1a;
}

.threshold-line {
  position: absolute;
  top: -4px;
  width: 2px;
  height: 16px;
  background: var(--c-brand);
  border-radius: 1px;
  transition: left 0.2s;
}

.no-query {
  font-size: 13px;
  color: var(--c-text-lighter);
  padding: 12px 0;
}
</style>
