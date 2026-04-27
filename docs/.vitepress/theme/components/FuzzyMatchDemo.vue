<template>
  <div class="fuzzy-match-demo">
    <div class="demo-controls">
      <label>
        <span class="control-label">Pattern</span>
        <input type="text" v-model="pattern" @input="reset" placeholder="javscript" />
      </label>
      <label>
        <span class="control-label">Text</span>
        <input type="text" v-model="text" @input="reset" placeholder="JavaScript" />
      </label>
      <button class="demo-btn" @click="stepForward" :disabled="done || !pattern || !text">
        Step →
      </button>
      <button class="demo-btn secondary" @click="reset" :disabled="step === 0">
        Reset
      </button>
    </div>

    <div class="demo-examples">
      <button
        v-for="ex in examples"
        :key="ex.pattern"
        class="example-btn"
        @click="loadExample(ex)"
      >
        "{{ ex.pattern }}" → "{{ ex.text }}"
      </button>
    </div>

    <div class="match-visualization" v-if="alignment.length > 0">
      <div class="match-row">
        <span class="row-label">Pattern</span>
        <span
          v-for="(cell, i) in alignment"
          :key="'p' + i"
          class="match-cell"
          :class="getCellClass(cell, i)"
        >{{ cell.patternChar || '—' }}</span>
      </div>
      <div class="match-row connector-row">
        <span class="row-label"></span>
        <span
          v-for="(cell, i) in alignment"
          :key="'c' + i"
          class="match-cell connector"
          :class="getCellClass(cell, i)"
        >{{ getConnector(cell) }}</span>
      </div>
      <div class="match-row">
        <span class="row-label">Text</span>
        <span
          v-for="(cell, i) in alignment"
          :key="'t' + i"
          class="match-cell"
          :class="getCellClass(cell, i)"
        >{{ cell.textChar || '—' }}</span>
      </div>
    </div>

    <div class="match-legend" v-if="alignment.length > 0">
      <span class="legend-item"><span class="legend-dot exact"></span> Exact match</span>
      <span class="legend-item"><span class="legend-dot substitution"></span> Substitution</span>
      <span class="legend-item"><span class="legend-dot insertion"></span> Insertion/Deletion</span>
      <span class="legend-item"><span class="legend-dot pending"></span> Pending</span>
    </div>

    <div class="match-stats" v-if="alignment.length > 0">
      <div class="stat">
        <span class="stat-label">Edit Distance</span>
        <span class="stat-value">{{ editCount }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Score</span>
        <span class="stat-value">{{ score }}</span>
      </div>
      <div class="stat" v-if="done || step === 0">
        <span class="stat-label">Verdict</span>
        <span class="stat-value" :class="verdictClass">{{ verdict }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface AlignmentCell {
  patternChar: string
  textChar: string
  type: 'match' | 'substitution' | 'insertion' | 'deletion'
}

interface Example {
  pattern: string
  text: string
}

const examples: Example[] = [
  { pattern: 'javscript', text: 'JavaScript' },
  { pattern: 'react', text: 'react' },
  { pattern: 'pythn', text: 'python' },
]

const pattern = ref('javscript')
const text = ref('JavaScript')
const step = ref(0)

const alignment = computed<AlignmentCell[]>(() => {
  if (!pattern.value || !text.value) return []
  return computeAlignment(pattern.value, text.value.toLowerCase())
})

const done = computed(() => step.value >= alignment.value.length)

const totalEdits = computed(() => {
  return alignment.value.filter(c => c.type !== 'match').length
})

const editCount = computed(() => {
  if (step.value === 0) return totalEdits.value
  return alignment.value.slice(0, step.value).filter(c => c.type !== 'match').length
})

const score = computed(() => {
  if (alignment.value.length === 0) return '—'
  const edits = step.value === 0 ? totalEdits.value : alignment.value.slice(0, step.value).filter(c => c.type !== 'match').length
  const len = Math.max(pattern.value.length, text.value.length)
  return (edits / len).toFixed(2)
})

const verdict = computed(() => {
  const s = parseFloat(score.value)
  if (s <= 0.2) return 'Strong match'
  if (s <= 0.4) return 'Good match'
  if (s <= 0.6) return 'Weak match'
  return 'No match'
})

const verdictClass = computed(() => {
  const s = parseFloat(score.value)
  if (s <= 0.2) return 'verdict-strong'
  if (s <= 0.4) return 'verdict-good'
  if (s <= 0.6) return 'verdict-weak'
  return 'verdict-none'
})

function computeAlignment(p: string, t: string): AlignmentCell[] {
  const m = p.length
  const n = t.length

  // Build DP table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j - 1], // substitution
          dp[i - 1][j],     // deletion
          dp[i][j - 1]      // insertion
        )
      }
    }
  }

  // Traceback
  const cells: AlignmentCell[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && p[i - 1] === t[j - 1]) {
      cells.unshift({ patternChar: p[i - 1], textChar: t[j - 1], type: 'match' })
      i--; j--
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      cells.unshift({ patternChar: p[i - 1], textChar: t[j - 1], type: 'substitution' })
      i--; j--
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      cells.unshift({ patternChar: p[i - 1], textChar: '', type: 'deletion' })
      i--
    } else {
      cells.unshift({ patternChar: '', textChar: t[j - 1], type: 'insertion' })
      j--
    }
  }

  // Restore original casing from text
  let tj = 0
  for (const cell of cells) {
    if (cell.textChar) {
      cell.textChar = text.value[tj]
      tj++
    }
  }

  return cells
}

function getCellClass(cell: AlignmentCell, index: number) {
  if (index >= step.value) return 'pending'
  return cell.type
}

function getConnector(cell: AlignmentCell): string {
  if (cell.type === 'match') return '│'
  if (cell.type === 'substitution') return '≠'
  if (cell.type === 'insertion') return '+'
  if (cell.type === 'deletion') return '−'
  return ' '
}

function stepForward() {
  if (step.value < alignment.value.length) {
    step.value++
  }
}

function reset() {
  step.value = 0
}

function loadExample(ex: Example) {
  pattern.value = ex.pattern
  text.value = ex.text
  reset()
}
</script>

<style scoped lang="css">
.fuzzy-match-demo {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background: var(--c-bg);
}

.demo-controls {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
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

.demo-controls input {
  padding: 6px 10px;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-size: 14px;
  font-family: var(--font-family-code);
  background: var(--c-bg);
  color: var(--c-text);
  width: 140px;
}

.demo-btn {
  padding: 6px 16px;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: var(--c-brand);
  color: #fff;
  white-space: nowrap;
}

.demo-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.demo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.demo-btn.secondary {
  background: var(--c-bg);
  color: var(--c-text);
}

.demo-examples {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.example-btn {
  padding: 3px 10px;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  font-size: 12px;
  font-family: var(--font-family-code);
  background: var(--c-bg);
  color: var(--c-text-lighter);
  cursor: pointer;
}

.example-btn:hover {
  border-color: var(--c-brand);
  color: var(--c-brand);
}

.match-visualization {
  margin: 20px 0;
  overflow-x: auto;
}

.match-row {
  display: flex;
  align-items: center;
  gap: 0;
}

.row-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-lighter);
  text-transform: uppercase;
  width: 60px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 12px;
}

.connector-row .row-label {
  visibility: hidden;
}

.match-cell {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-code);
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  margin: 2px;
  transition: background-color 0.3s, color 0.3s;
}

.connector-row .match-cell {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
}

.match-cell.pending {
  background: var(--c-bg-lighter, #f5f5f5);
  color: var(--c-text-lightest, #ccc);
}

.dark .match-cell.pending {
  background: var(--c-bg-light, #2a2a2a);
  color: #555;
}

.match-cell.match {
  background: #d4edda;
  color: #155724;
}

.dark .match-cell.match {
  background: #1a3a2a;
  color: #75d49b;
}

.match-cell.substitution {
  background: #fff3cd;
  color: #856404;
}

.dark .match-cell.substitution {
  background: #3a3520;
  color: #f0c040;
}

.match-cell.insertion,
.match-cell.deletion {
  background: #f8d7da;
  color: #721c24;
}

.dark .match-cell.insertion,
.dark .match-cell.deletion {
  background: #3a1a1a;
  color: #f0757a;
}

.match-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 12px 0;
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

.legend-dot.exact { background: #d4edda; }
.legend-dot.substitution { background: #fff3cd; }
.legend-dot.insertion { background: #f8d7da; }
.legend-dot.pending { background: #f5f5f5; }

.dark .legend-dot.exact { background: #1a3a2a; }
.dark .legend-dot.substitution { background: #3a3520; }
.dark .legend-dot.insertion { background: #3a1a1a; }
.dark .legend-dot.pending { background: #2a2a2a; }

.match-stats {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--c-border);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-lighter);
  text-transform: uppercase;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-family-code);
}

.verdict-strong { color: #155724; }
.verdict-good { color: #1a6b35; }
.verdict-weak { color: #856404; }
.verdict-none { color: #721c24; }

.dark .verdict-strong { color: #75d49b; }
.dark .verdict-good { color: #5cb87a; }
.dark .verdict-weak { color: #f0c040; }
.dark .verdict-none { color: #f0757a; }
</style>
