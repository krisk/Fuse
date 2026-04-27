<template>
  <div class="bitap-demo">
    <div class="demo-controls">
      <label>
        <span class="control-label">Pattern</span>
        <input type="text" v-model="pattern" @input="reset" maxlength="8" placeholder="abc" />
      </label>
      <label>
        <span class="control-label">Text</span>
        <input type="text" v-model="text" @input="reset" placeholder="xabcxy" />
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
        :key="ex.pattern + ex.text"
        class="example-btn"
        @click="loadExample(ex)"
      >
        "{{ ex.pattern }}" in "{{ ex.text }}"
      </button>
    </div>

    <!-- Text with cursor -->
    <div class="text-track">
      <span
        v-for="(ch, i) in text"
        :key="i"
        class="text-char"
        :class="{
          'current': i === step - 1,
          'scanned': i < step - 1,
          'match-range': isInMatchRange(i)
        }"
      >{{ ch }}</span>
    </div>

    <!-- Combined step view -->
    <div class="step-view" v-if="step > 0 && currentStep">
      <div class="step-header">
        Reading <strong class="mono">'{{ currentStep.textChar }}'</strong>
        <span class="step-count">step {{ step }} of {{ steps.length }}</span>
      </div>

      <!-- Operation breakdown -->
      <div class="operation">
        <div class="op-row">
          <span class="op-label">Previous R</span>
          <span
            class="bit-cell"
            :class="bit === 1 ? 'bit-match' : 'bit-empty'"
            v-for="(bit, i) in currentStep.prevR"
            :key="'prev' + i"
          >{{ bit }}</span>
        </div>

        <div class="op-arrow">↓ (R &gt;&gt; 1) | seed</div>

        <div class="op-row">
          <span class="op-label">shifted</span>
          <span
            class="bit-cell"
            :class="[
              bit === 1 ? 'bit-match' : 'bit-empty',
              bit !== currentStep.prevR[i] ? 'bit-changed' : ''
            ]"
            v-for="(bit, i) in currentStep.shifted"
            :key="'shift' + i"
          >{{ bit }}</span>
        </div>

        <div class="op-arrow">↓ AND with mask for '{{ currentStep.textChar.toLowerCase() }}'</div>

        <div class="op-row">
          <span class="op-label">mask['{{ currentStep.textChar.toLowerCase() }}']</span>
          <span
            class="bit-cell"
            :class="bit === 1 ? 'bit-match' : 'bit-empty'"
            v-for="(bit, i) in currentStep.mask"
            :key="'mask' + i"
          >{{ bit }}</span>
          <span class="mask-hint">
            <template v-for="(ch, i) in patternChars" :key="i">
              <span :class="{ 'hint-match': currentStep.mask[i] === 1 }">{{ ch }}</span>
            </template>
          </span>
        </div>

        <div class="op-arrow">↓ result</div>

        <div class="op-row result-row">
          <span class="op-label">New R</span>
          <span
            class="bit-cell"
            :class="[
              bit === 1 ? 'bit-match' : 'bit-empty',
              bit !== currentStep.shifted[i] ? 'bit-changed' : ''
            ]"
            v-for="(bit, i) in currentStep.bits"
            :key="'result' + i"
          >{{ bit }}</span>
          <span v-if="currentStep.isMatch" class="match-badge">Match!</span>
        </div>
      </div>

      <!-- Pattern position labels -->
      <div class="position-labels">
        <span class="op-label"></span>
        <span class="bit-cell-label" v-for="(ch, i) in patternChars" :key="'pos' + i">
          {{ ch }}<sub>{{ i }}</sub>
        </span>
      </div>

      <div class="step-narrative">
        <template v-if="currentStep.isMatch">
          The rightmost bit is <code>1</code> — all pattern positions matched. Match ends at text position <strong>{{ step - 1 }}</strong>
          (starts at <strong>{{ currentStep.matchPos }}</strong>).
        </template>
        <template v-else-if="currentStep.bits.some(b => b === 1)">
          {{ countOnes(currentStep.bits) }} position{{ countOnes(currentStep.bits) > 1 ? 's' : '' }} still tracking
          ({{ describeOnes(currentStep.bits) }}) — partial match in progress.
        </template>
        <template v-else>
          All bits are <code>0</code> — no partial match is alive.
        </template>
      </div>
    </div>

    <!-- Initial state -->
    <div class="step-view initial" v-else-if="pattern && text">
      <div class="step-header">
        Initial state — all bits are <code>0</code> (no matches yet)
      </div>
      <div class="operation">
        <div class="op-row">
          <span class="op-label">R</span>
          <span class="bit-cell bit-empty" v-for="i in patternLen" :key="'init' + i">0</span>
        </div>
      </div>
      <div class="position-labels">
        <span class="op-label"></span>
        <span class="bit-cell-label" v-for="(ch, i) in patternChars" :key="'ipos' + i">
          {{ ch }}<sub>{{ i }}</sub>
        </span>
      </div>
    </div>

    <div class="match-summary" v-if="done">
      <template v-if="matches.length > 0">
        Found <strong>{{ matches.length }}</strong> exact match{{ matches.length > 1 ? 'es' : '' }}
        at position{{ matches.length > 1 ? 's' : '' }}
        <strong>{{ matches.join(', ') }}</strong>.
      </template>
      <template v-else>
        No exact match found.
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import createPatternAlphabet from '../../../../src/search/bitap/createPatternAlphabet'

interface Step {
  textChar: string
  prevR: number[]
  shifted: number[]
  mask: number[]
  bits: number[]
  isMatch: boolean
  matchPos: number
}

const examples = [
  { pattern: 'test', text: 'xtest' },
  { pattern: 'abc', text: 'xabcxy' },
  { pattern: 'ab', text: 'aab' },
]

const pattern = ref('test')
const text = ref('xtest')
const step = ref(0)

const patternLower = computed(() => pattern.value.toLowerCase())
const textLower = computed(() => text.value.toLowerCase())
const patternLen = computed(() => pattern.value.length)
const patternChars = computed(() => patternLower.value.split(''))

// Use Fuse.js's own createPatternAlphabet to build bitmasks
const patternAlphabet = computed(() => {
  if (!patternLower.value) return {}
  return createPatternAlphabet(patternLower.value)
})

// Convert an integer bitmask to an array of bits for display (MSB first).
// In Fuse's alphabet: bit (len-1) = pattern[0], bit 0 = pattern[len-1].
// MSB first means pattern chars display left-to-right in natural order.
// The `| 1` seeds at the rightmost position (last pattern char),
// and the shift left propagates matches toward the leftmost (first pattern char).
function intToBits(n: number, len: number): number[] {
  const bits: number[] = []
  for (let i = len - 1; i >= 0; i--) {
    bits.push((n >> i) & 1)
  }
  return bits
}

const steps = computed<Step[]>(() => {
  const p = patternLower.value
  const t = textLower.value
  if (!p || !t) return []

  const m = p.length
  const result: Step[] = []
  const alphabet = patternAlphabet.value

  // Seed mask: MSB = first pattern char position
  const seedMask = 1 << (m - 1)
  // Match detection: bit 0 (LSB) = last pattern char
  const matchBit = 1

  // State: starts at 0 (no bits set = no matches)
  let R = 0

  for (let j = 0; j < t.length; j++) {
    const c = t[j]
    const charMatch = alphabet[c] || 0
    const prevR = R

    // Adapted for left-to-right text scanning:
    // Shift right to propagate matches from first pattern char toward last,
    // seed MSB (first position), AND with char mask from createPatternAlphabet.
    const shifted = (R >> 1) | seedMask
    const newR = shifted & charMatch

    const isMatch = (newR & matchBit) !== 0

    result.push({
      textChar: text.value[j],
      prevR: intToBits(prevR, m),
      shifted: intToBits(shifted, m),
      mask: intToBits(charMatch, m),
      bits: intToBits(newR, m),
      isMatch,
      matchPos: isMatch ? j - m + 1 : -1
    })

    R = newR
  }

  return result
})

const currentStep = computed(() => {
  if (step.value === 0) return null
  return steps.value[step.value - 1]
})

const done = computed(() => step.value >= steps.value.length)

const matches = computed(() => {
  return steps.value.filter(s => s.isMatch).map(s => s.matchPos)
})

function isInMatchRange(textIdx: number): boolean {
  if (step.value === 0) return false
  for (const s of steps.value.slice(0, step.value)) {
    if (s.isMatch) {
      const start = s.matchPos
      const end = start + patternLen.value - 1
      if (textIdx >= start && textIdx <= end) return true
    }
  }
  return false
}

function countOnes(bits: number[]): number {
  return bits.filter(b => b === 1).length
}

function describeOnes(bits: number[]): string {
  const positions = bits
    .map((b, i) => b === 1 ? `position ${i}` : null)
    .filter(Boolean)
  return positions.join(', ')
}

function stepForward() {
  if (step.value < steps.value.length) {
    step.value++
  }
}

function reset() {
  step.value = 0
}

function loadExample(ex: { pattern: string; text: string }) {
  pattern.value = ex.pattern
  text.value = ex.text
  reset()
}
</script>

<style scoped lang="css">
.bitap-demo {
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
  width: 120px;
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

.demo-btn:hover:not(:disabled) { opacity: 0.9; }
.demo-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.demo-btn.secondary { background: var(--c-bg); color: var(--c-text); }

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

.example-btn:hover { border-color: var(--c-brand); color: var(--c-brand); }

/* Text track */
.text-track {
  display: flex;
  gap: 2px;
  margin-bottom: 16px;
  padding: 8px 0;
}

.text-char {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-code);
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  background: #f0f0f0;
  color: var(--c-text-lighter);
  transition: all 0.3s;
}

.dark .text-char { background: #2a2a2a; }

.text-char.scanned {
  color: var(--c-text);
  background: #e8e8e8;
}

.dark .text-char.scanned { background: #333; }

.text-char.current {
  background: var(--c-brand);
  color: #fff;
  transform: scale(1.1);
}

.text-char.match-range {
  background: #d4edda;
  color: #155724;
}

.dark .text-char.match-range { background: #1a3a2a; color: #75d49b; }

.text-char.current.match-range {
  background: #28a745;
  color: #fff;
}

/* Step view */
.step-view {
  background: var(--c-bg-lighter, #fafafa);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
}

.dark .step-view { background: var(--c-bg-light, #1e1e1e); }

.step-view.initial { opacity: 0.7; }

.step-header {
  font-size: 14px;
  margin-bottom: 12px;
  color: var(--c-text);
}

.step-count {
  float: right;
  font-size: 12px;
  color: var(--c-text-lighter);
}

.mono { font-family: var(--font-family-code); }

/* Operation breakdown */
.operation {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.op-row {
  display: flex;
  align-items: center;
  gap: 0;
}

.op-label {
  width: 100px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-family-code);
  color: var(--c-text-lighter);
  text-align: right;
  padding-right: 12px;
  flex-shrink: 0;
}

.op-arrow {
  font-size: 12px;
  color: var(--c-text-lightest, #aaa);
  padding-left: 100px;
  margin: 4px 0;
}

.result-row {
  margin-top: 2px;
  padding-top: 4px;
  border-top: 2px solid var(--c-border);
}

.bit-cell {
  width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-code);
  font-size: 14px;
  font-weight: 600;
  margin: 1px;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.bit-cell.bit-match {
  background: #d4edda;
  color: #155724;
}

.dark .bit-cell.bit-match { background: #1a3a2a; color: #75d49b; }

.bit-cell.bit-empty {
  background: #f0f0f0;
  color: #999;
}

.dark .bit-cell.bit-empty { background: #2a2a2a; color: #666; }

.bit-cell.bit-changed {
  outline: 2px solid var(--c-brand);
  outline-offset: -2px;
}

.mask-hint {
  padding-left: 8px;
  font-size: 12px;
  font-family: var(--font-family-code);
  color: var(--c-text-lightest, #aaa);
}

.mask-hint .hint-match {
  color: #155724;
  font-weight: 700;
}

.dark .mask-hint .hint-match { color: #75d49b; }

.position-labels {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.bit-cell-label {
  width: 32px;
  margin: 1px;
  text-align: center;
  font-size: 11px;
  font-family: var(--font-family-code);
  color: var(--c-text-lightest, #aaa);
}

.bit-cell-label sub { font-size: 9px; }

.match-badge {
  font-size: 13px;
  font-weight: 700;
  color: #155724;
  background: #d4edda;
  padding: 2px 10px;
  border-radius: 10px;
  margin-left: 8px;
}

.dark .match-badge { background: #1a3a2a; color: #75d49b; }

.step-narrative {
  margin-top: 12px;
  font-size: 13px;
  color: var(--c-text-lighter);
  line-height: 1.5;
}

.match-summary {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--c-border);
  font-size: 14px;
}
</style>
