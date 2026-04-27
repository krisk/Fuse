<template>
  <div class="playground">
    <div class="playground-controls">
      <div class="search-input-wrapper">
        <input
          type="text"
          class="search-input"
          v-model="searchPattern"
          placeholder="Try searching… e.g. &quot;old man&quot;, &quot;ste ham&quot;, &quot;^the&quot;"
          @input="doSearch"
        />
      </div>

      <div class="options-bar">
        <label class="option" title="Match sensitivity — 0 requires a perfect match, 1 matches anything">
          <span class="option-label">threshold</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            v-model.number="options.threshold"
            @input="doSearch"
          />
          <span class="option-value">{{ options.threshold.toFixed(1) }}</span>
        </label>

        <label class="option" title="Include the relevance score (0 = perfect, 1 = mismatch) in each result">
          <input type="checkbox" v-model="options.includeScore" @change="doSearch" />
          <span class="option-label">includeScore</span>
        </label>

        <label class="option" title="Include matched character indices in results — used for highlighting">
          <input type="checkbox" v-model="options.includeMatches" @change="doSearch" />
          <span class="option-label">includeMatches</span>
        </label>

        <label class="option" title="Ignore where in the string the match occurs — match anywhere">
          <input type="checkbox" v-model="options.ignoreLocation" @change="doSearch" />
          <span class="option-label">ignoreLocation</span>
        </label>

        <label class="option" title="Enable operators like =exact, ^prefix, !inverse, 'include, suffix$">
          <input type="checkbox" v-model="options.useExtendedSearch" @change="doSearch" />
          <span class="option-label">useExtendedSearch</span>
        </label>

        <label class="option" title="Split query into words, fuzzy-match each independently, rank with IDF">
          <input type="checkbox" v-model="options.useTokenSearch" @change="doSearch" />
          <span class="option-label">useTokenSearch</span>
        </label>
      </div>
    </div>

    <div class="playground-columns">
      <div class="playground-data">
        <div class="panel-header">
          <span class="panel-title">Data</span>
          <span class="panel-meta">{{ bookCount }} items</span>
        </div>
        <textarea
          class="data-editor"
          v-model="jsonData"
          @input="onDataChange"
          spellcheck="false"
        ></textarea>
      </div>

      <div class="playground-results">
        <div class="panel-header">
          <span class="panel-title">Results</span>
          <span class="panel-meta" v-if="searchPattern">
            {{ results.length }} found
            <template v-if="searchTime !== null"> in {{ searchTime }}ms</template>
          </span>
        </div>

        <div class="results-list" v-if="searchPattern">
          <div v-if="results.length === 0" class="no-results">No matches</div>
          <div
            v-for="(result, i) in results"
            :key="i"
            class="result-item"
          >
            <div class="result-title">
              <span v-html="highlightMatch(result, 'title')"></span>
            </div>
            <div class="result-author">
              <span v-html="highlightMatch(result, 'author.firstName')"></span>
              {{ ' ' }}
              <span v-html="highlightMatch(result, 'author.lastName')"></span>
            </div>
            <div class="result-score" v-if="options.includeScore && result.score != null">
              score: {{ result.score.toFixed(4) }}
            </div>
          </div>
        </div>

        <div class="results-list" v-else>
          <div class="no-results hint">Type to search</div>
        </div>
      </div>
    </div>

    <div class="playground-code">
      <div class="panel-header">
        <span class="panel-title">Code</span>
      </div>
      <div class="code-block">{{ generatedCode }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Fuse from '../../../../dist/fuse'

const books = [
  { title: "Old Man's War", author: { firstName: 'John', lastName: 'Scalzi' } },
  { title: 'The Lock Artist', author: { firstName: 'Steve', lastName: 'Hamilton' } },
  { title: 'HTML5', author: { firstName: 'Remy', lastName: 'Sharp' } },
  { title: 'Right Ho Jeeves', author: { firstName: 'P.D', lastName: 'Woodhouse' } },
  { title: 'The Code of the Wooster', author: { firstName: 'P.D', lastName: 'Woodhouse' } },
  { title: 'Thank You Jeeves', author: { firstName: 'P.D', lastName: 'Woodhouse' } },
  { title: 'The DaVinci Code', author: { firstName: 'Dan', lastName: 'Brown' } },
  { title: 'Angels & Demons', author: { firstName: 'Dan', lastName: 'Brown' } },
  { title: 'The Silmarillion', author: { firstName: 'J.R.R', lastName: 'Tolkien' } },
  { title: 'Syrup', author: { firstName: 'Max', lastName: 'Barry' } },
  { title: 'The Lost Symbol', author: { firstName: 'Dan', lastName: 'Brown' } },
  { title: 'The Book of Lies', author: { firstName: 'Brad', lastName: 'Meltzer' } },
  { title: 'Lamb', author: { firstName: 'Christopher', lastName: 'Moore' } },
  { title: 'Fool', author: { firstName: 'Christopher', lastName: 'Moore' } },
  { title: 'The Grand Design', author: { firstName: 'Stephen', lastName: 'Hawking' } },
  { title: 'The Book of Samson', author: { firstName: 'David', lastName: 'Maine' } },
  { title: 'The Preservationist', author: { firstName: 'David', lastName: 'Maine' } },
  { title: 'Fallen', author: { firstName: 'David', lastName: 'Maine' } },
  { title: 'Monster 1959', author: { firstName: 'David', lastName: 'Maine' } }
]

const searchPattern = ref('')
const jsonData = ref(JSON.stringify(books, null, 2))
const results = ref<any[]>([])
const searchTime = ref<string | null>(null)
let parsedData = [...books]

const options = reactive({
  threshold: 0.6,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: false,
  useExtendedSearch: false,
  useTokenSearch: false
})

const bookCount = computed(() => parsedData.length)

const generatedCode = computed(() => {
  const opts: string[] = []
  if (options.threshold !== 0.6) opts.push(`  threshold: ${options.threshold}`)
  if (options.includeScore) opts.push(`  includeScore: true`)
  if (options.includeMatches) opts.push(`  includeMatches: true`)
  if (options.ignoreLocation) opts.push(`  ignoreLocation: true`)
  if (options.useExtendedSearch) opts.push(`  useExtendedSearch: true`)
  if (options.useTokenSearch) opts.push(`  useTokenSearch: true`)
  opts.push(`  keys: ['title', 'author.firstName', 'author.lastName']`)

  return `const fuse = new Fuse(books, {\n${opts.join(',\n')}\n})\n\nfuse.search('${searchPattern.value}')`
})

function onDataChange() {
  try {
    parsedData = JSON.parse(jsonData.value)
    doSearch()
  } catch {
    // invalid JSON, skip
  }
}

function doSearch() {
  if (!searchPattern.value) {
    results.value = []
    searchTime.value = null
    return
  }

  try {
    const fuseOptions = {
      ...options,
      keys: ['title', 'author.firstName', 'author.lastName']
    }

    const fuse = new Fuse(parsedData, fuseOptions)
    const start = performance.now()
    results.value = fuse.search(searchPattern.value)
    searchTime.value = (performance.now() - start).toFixed(1)
  } catch {
    results.value = []
    searchTime.value = null
  }
}

function highlightMatch(result: any, key: string) {
  if (!options.includeMatches || !result.matches) {
    return getNestedValue(result.item, key)
  }

  const match = result.matches.find((m: any) => m.key === key)
  const value = getNestedValue(result.item, key)

  if (!match || !match.indices || !value) return value || ''

  let highlighted = ''
  let lastIndex = 0

  const indices = [...match.indices].sort((a: number[], b: number[]) => a[0] - b[0])

  for (const [start, end] of indices) {
    highlighted += escapeHtml(value.slice(lastIndex, start))
    highlighted += `<mark>${escapeHtml(value.slice(start, end + 1))}</mark>`
    lastIndex = end + 1
  }
  highlighted += escapeHtml(value.slice(lastIndex))

  return highlighted
}

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((o, k) => o?.[k], obj) ?? ''
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
</script>

<style scoped>
.playground {
  margin-top: 1rem;
}

.search-input-wrapper {
  margin-bottom: 0.75rem;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  font-size: 1.1rem;
  border: 2px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-bg);
  color: var(--c-text);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: var(--c-brand);
}

.options-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  color: var(--c-text-lighter);
}

.option-label {
  font-family: var(--font-family-code);
}

.option-value {
  font-family: var(--font-family-code);
  min-width: 2em;
}

.option input[type="range"] {
  width: 80px;
}

.playground-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .playground-columns {
    grid-template-columns: 1fr;
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.4rem;
}

.panel-title {
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-text-lighter);
}

.panel-meta {
  font-size: 0.8rem;
  color: var(--c-text-lightest);
  font-family: var(--font-family-code);
}

.data-editor {
  width: 100%;
  height: 300px;
  padding: 0.6rem;
  font-family: var(--font-family-code);
  font-size: 0.8rem;
  line-height: 1.5;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-bg-lighter);
  color: var(--c-text);
  resize: vertical;
  box-sizing: border-box;
}

.results-list {
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-bg-lighter);
  height: 300px;
  overflow-y: auto;
}

.result-item {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--c-border-dark, #eee);
}

.result-item:last-child {
  border-bottom: none;
}

.result-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.result-author {
  font-size: 0.85rem;
  color: var(--c-text-lighter);
}

.result-score {
  font-size: 0.75rem;
  font-family: var(--font-family-code);
  color: var(--c-text-lightest);
  margin-top: 0.15rem;
}

.result-item :deep(mark) {
  background-color: rgba(255, 213, 0, 0.4);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
}

.no-results {
  padding: 1.5rem;
  text-align: center;
  color: var(--c-text-lightest);
}

.no-results.hint {
  font-style: italic;
}

.playground-code {
  margin-top: 0.5rem;
}

.code-block {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: var(--font-family-code);
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre;
  background: var(--playground-code-bg);
  color: var(--playground-code-text);
  border: 1px solid var(--c-border);
}
</style>

<style>
:root {
  --playground-code-bg: #f6f8fa;
  --playground-code-text: #24292f;
}
html.dark {
  --playground-code-bg: #161b22;
  --playground-code-text: #c9d1d9;
}
</style>
