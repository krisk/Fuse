<template>
  <div class="search-window-demo">
    <div class="demo-controls">
      <label>
        <span class="control-label">Query</span>
        <input type="text" v-model="query" placeholder="zero" />
      </label>
    </div>

    <div class="sliders">
      <div class="slider-row">
        <span class="slider-label">threshold</span>
        <input type="range" min="0" max="1" step="0.05" v-model.number="threshold" class="slider" />
        <span class="slider-value">{{ threshold.toFixed(2) }}</span>
      </div>
      <div class="slider-row">
        <span class="slider-label">location</span>
        <input type="range" min="0" :max="textLen" step="1" v-model.number="location" class="slider" />
        <span class="slider-value">{{ location }}</span>
      </div>
      <div class="slider-row">
        <span class="slider-label">distance</span>
        <input type="range" min="0" max="500" step="10" v-model.number="distance" class="slider" />
        <span class="slider-value">{{ distance }}</span>
      </div>
    </div>

    <!-- Text visualization -->
    <div class="text-viz">
      <div class="text-bar">
        <span
          v-for="(ch, i) in textChars"
          :key="i"
          class="char"
          :class="{
            'in-window': isInWindow(i),
            'at-location': i === location,
            'is-match': isMatchChar(i)
          }"
        >{{ ch }}</span>
      </div>
    </div>

    <div class="legend">
      <span class="legend-item"><span class="legend-dot location"></span> Location</span>
      <span class="legend-item"><span class="legend-dot window"></span> Search window</span>
      <span class="legend-item" v-if="matchIndices.length"><span class="legend-dot match"></span> Match found</span>
    </div>

    <div class="window-info">
      <p>
        Effective window: characters <strong>{{ windowStart }}</strong> to <strong>{{ windowEnd }}</strong>
        ({{ windowSize }} chars).
        <template v-if="distance === 0">
          Distance is 0 — only exact position matches.
        </template>
        <template v-else>
          A match {{ Math.round(threshold * distance) }} characters from position {{ location }} would be at the threshold cutoff.
        </template>
      </p>
      <p class="scoring-note">
        Note: <code>distance</code> also affects scoring — a larger distance means less penalty per character of offset, so the same match gets a better score.
      </p>
    </div>

    <!-- Result -->
    <div class="result-section" v-if="query">
      <div class="result-row" :class="{ pass: result.isMatch, fail: !result.isMatch }">
        <span class="result-label">{{ result.isMatch ? 'Match' : 'No match' }}</span>
        <span class="result-score" v-if="result.score !== undefined">
          score: {{ result.score === 0 ? 'perfect' : result.score.toFixed(3) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Fuse from '../../../../dist/fuse'

const sampleText = 'Search for books, movies, and music in your library'

const query = ref('music')
const threshold = ref(0.6)
const location = ref(0)
const distance = ref(100)

const textChars = computed(() => sampleText.split(''))
const textLen = computed(() => sampleText.length)

// Approximate the effective search window
const windowStart = computed(() => {
  const maxOffset = Math.floor(threshold.value * distance.value)
  return Math.max(0, location.value - maxOffset)
})

const windowEnd = computed(() => {
  const maxOffset = Math.floor(threshold.value * distance.value)
  return Math.min(textLen.value - 1, location.value + maxOffset)
})

const windowSize = computed(() => windowEnd.value - windowStart.value + 1)

function isInWindow(i: number): boolean {
  return i >= windowStart.value && i <= windowEnd.value
}

// Run actual Fuse search
const fuseResult = computed(() => {
  if (!query.value) return null
  const fuse = new Fuse([sampleText], {
    includeScore: true,
    includeMatches: true,
    threshold: threshold.value,
    location: location.value,
    distance: distance.value,
  })
  const results = fuse.search(query.value)
  return results.length > 0 ? results[0] : null
})

const result = computed(() => {
  if (!query.value) return { isMatch: false }
  if (fuseResult.value) {
    return {
      isMatch: true,
      score: fuseResult.value.score,
    }
  }
  return { isMatch: false }
})

const matchIndices = computed(() => {
  if (!fuseResult.value?.matches) return []
  const indices: number[] = []
  for (const m of fuseResult.value.matches) {
    if (m.indices) {
      for (const [start, end] of m.indices) {
        for (let i = start; i <= end; i++) {
          indices.push(i)
        }
      }
    }
  }
  return indices
})

function isMatchChar(i: number): boolean {
  return matchIndices.value.includes(i)
}

</script>

<style scoped lang="css">
.search-window-demo {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background: var(--c-bg);
}

.demo-controls {
  margin-bottom: 12px;
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

.sliders {
  margin-bottom: 16px;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.slider-label {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-family-code);
  color: var(--c-text-lighter);
  width: 80px;
  flex-shrink: 0;
  text-align: right;
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

/* Text visualization */
.text-viz {
  margin: 16px 0 8px;
  overflow-x: auto;
}



.text-bar {
  display: flex;
  gap: 0;
  padding: 4px 0;
}

.char {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 11px;
  height: 26px;
  font-family: var(--font-family-code);
  font-size: 20px;
  color: var(--c-text);
  background: #f0f0f0;
  border-radius: 1px;
  margin: 0 0.5px;
  transition: all 0.2s;
  opacity: 0.25;
}

.dark .char {
  background: #2a2a2a;
  color: var(--c-text-lighter);
}

.char.in-window {
  opacity: 1;
  background: #e8f0fe;
}

.dark .char.in-window {
  background: #1a2a3a;
}

.char.at-location {
  box-shadow: inset 0 3px 0 var(--c-brand);
}

.char.is-match {
  background: #d4edda;
  color: #155724;
  font-weight: 700;
}

.dark .char.is-match {
  background: #1a3a2a;
  color: #75d49b;
}


.legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 8px 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--c-text-lighter);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-dot.location { background: var(--c-brand); }
.legend-dot.window { background: #e8f0fe; }
.legend-dot.match { background: #d4edda; }

.dark .legend-dot.window { background: #1a2a3a; }
.dark .legend-dot.match { background: #1a3a2a; }

.window-info {
  font-size: 13px;
  color: var(--c-text-lighter);
  line-height: 1.5;
  margin: 8px 0;
}

.scoring-note {
  font-size: 12px;
  color: var(--c-text-lightest, #aaa);
  margin-top: 4px;
}

.result-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--c-border);
}

.result-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.result-row.pass .result-label {
  color: #155724;
  font-weight: 700;
}

.dark .result-row.pass .result-label {
  color: #75d49b;
}

.result-row.fail .result-label {
  color: #721c24;
  font-weight: 700;
}

.dark .result-row.fail .result-label {
  color: #f0757a;
}

.result-score {
  font-family: var(--font-family-code);
  font-size: 13px;
  color: var(--c-text-lighter);
}
</style>
