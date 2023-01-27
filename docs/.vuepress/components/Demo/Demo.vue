<template>
  <section>
    <MonacoEditor
      language="json"
      v-model="state.jsonData"
      id="json-list-monaco-editor"
      file-name="list.json"
      file-description="list of items to search"
    ></MonacoEditor>
  </section>

  <section class="search-section">
    <input
      type="text"
      class="search-section-input"
      v-model="state.searchPattern"
      @keyup="onSearchPatternKeyUp"
      placeholder="Search..."
    />
  </section>

  <section>
    <MonacoEditor
      language="javascript"
      v-model="state.mainJsData"
      id="main-monaco-editor"
      file-name="main.js"
      file-description="entry module"
    ></MonacoEditor>
  </section>

  <section class="monaco-editor-results">
    <MonacoEditor
      language="json"
      v-model="state.resultsData"
      id="main-monaco-editor"
      file-name="Results:"
      :file-description="
        isNullish(state.count) || isNullish(state.searchTime)
          ? ''
          : 'found ' + state.count + ' in ' + state.searchTime + 'ms'
      "
      readonly
    ></MonacoEditor>
  </section>
</template>

<script setup lang="ts">
import { Stopwatch } from '@sapphire/stopwatch'
import { reactive } from 'vue'
import type FuseTypes from '../../../../dist/fuse'
import Fuse from '../../../../dist/fuse.esm.js'
import Books from './books.js'
import MonacoEditor from './MonacoEditor.vue'

interface State {
  searchPattern: string
  jsonData: string
  mainJsData: string
  resultsData: string
  count: number | null
  searchTime: number | null
  fuseSearchOptions: FuseTypes.IFuseOptions<never>
}

const defaultFuseSearchOptions: FuseTypes.IFuseOptions<never> = {
  isCaseSensitive: false,
  includeScore: false,
  shouldSort: true,
  includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 1,
  location: 0,
  threshold: 0.6,
  distance: 100,
  useExtendedSearch: false,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  fieldNormWeight: 1,
  keys: ['title', 'author.firstName']
}

let codify = (
  searchPattern: string,
  fuseSearchOptions: FuseTypes.IFuseOptions<never> = defaultFuseSearchOptions
): string => {
  return `
const Fuse = require('fuse.js');

const fuseOptions = {
${Object.entries(fuseSearchOptions)
  .map(([key, value]) => `\t// ${key}: ${value},`)
  .join('\n')}
\tkeys: [
\t\t"title",
\t\t"author.firstName"
\t]
};

const fuse = new Fuse(list, fuseOptions);

// Change the pattern
const searchPattern = "${searchPattern}"

return fuse.search(searchPattern)`
}

const state = reactive<State>({
  searchPattern: '',
  jsonData: JSON.stringify(Books, null, 2),
  mainJsData: codify(''),
  resultsData: JSON.stringify({}, null, 2),
  count: null,
  searchTime: null,
  fuseSearchOptions: defaultFuseSearchOptions
})

const isNullish = <T>(
  value: null | undefined | T
): value is null | undefined => {
  return value === null || value === undefined
}

function onSearchPatternKeyUp() {
  state.mainJsData = codify(state.searchPattern, state.fuseSearchOptions)

  doFuseSearch()
}

function doFuseSearch() {
  try {
    const fuseOptions: FuseTypes.IFuseOptions<never> = {
      ...state.fuseSearchOptions,
      keys: ['title', 'author.firstName']
    }

    const fuse = new Fuse(JSON.parse(state.jsonData), state.fuseSearchOptions)

    const stopwatch = new Stopwatch()

    const result = fuse.search(state.searchPattern)

    state.count = result.length
    state.searchTime = Math.floor(stopwatch.stop().duration)
    state.resultsData = JSON.stringify(result, null, 2)
  } catch {
    state.count = null
    state.searchTime = null
    state.resultsData = JSON.stringify({}, null, 2)
  }
}
</script>

<style scoped lang="css">
.monaco-editor-results {
  margin-top: 20px;
}

.search-section {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.search-section-input {
  font-size: 16px;
  width: 100%;

  color: rgb(156, 181, 200);
  background-color: rgb(24, 26, 27);
  background-image: none;
  border-color: rgb(56, 60, 63);

  padding: 0.45rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  width: 96%;
  border: 1px solid #e1e3e6;
  border-radius: 4px;
}

html.dark .search-section-input {
  border: 1px solid #878e99;
}
</style>
