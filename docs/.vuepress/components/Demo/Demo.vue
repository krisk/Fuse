<template>
  <section>
    <MonacoEditor
      language="json"
      :value="jsonData"
      id="json-list-monaco-editor"
      file-name="list.json"
      file-description="list of items to search"
    ></MonacoEditor>
  </section>

  <section class="search-section">
    <input
      type="text"
      class="search-section-input"
      v-model="searchPattern"
      @keyup="onSearchPatternKeyUp"
      placeholder="Search..."
    />
  </section>

  <section>
    <MonacoEditor
      language="typescript"
      :value="mainJsData"
      id="main-monaco-editor"
      file-name="main.js"
      file-description="entry module"
    ></MonacoEditor>
  </section>

  <section class="monaco-editor-results">
    <MonacoEditor
      language="json"
      :value="resultsData"
      id="main-monaco-editor"
      file-name="Results:"
      :file-description="
        isNullish(count) || isNullish(searchTime)
          ? ''
          : 'found ' + count + ' in ' + searchTime + 'ms'
      "
      readonly
    ></MonacoEditor>
  </section>
</template>

<script setup lang="ts">
import { Stopwatch } from '@sapphire/stopwatch'
import { ref } from 'vue'
import Fuse from '../../../../dist/fuse.esm.js'
import Books from './books.js'
import MonacoEditor from './MonacoEditor.vue'

const searchPattern = ref('')
const fuseSearchOptions = ref({
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
  fieldNormWeight: 1
})

let codify = () => {
  return `
const Fuse = require('fuse.js');

const fuseOptions = {
${Object.entries(fuseSearchOptions).map(([key, value]) => `\t// ${key}: ${value},`).join('\n')}
\tkeys: [
\t\t"title",
\t\t"author.firstName"
\t]
};

const fuse = new Fuse(list, fuseOptions);

// Change the pattern
const pattern = "${searchPattern.value}"

return fuse.search(pattern)`
}

const isNullish = <T>(
  value: null | undefined | T
): value is null | undefined => {
  return value === null || value === undefined
}

const jsonData = ref(JSON.stringify(Books, null, 2))
const mainJsData = ref(codify())
const resultsData = ref(JSON.stringify({}, null, 2))
const count = ref<number | null>(null)
const searchTime = ref<number | null>(null)

console.log('>>>>', resultsData.value)

function onSearchPatternKeyUp() {
  mainJsData.value = codify()

  doFuseSearch()
}

function doFuseSearch() {
  try {
    const fuseOptions = {
      // isCaseSensitive: false,
      // includeScore: false,
      // shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      // threshold: 0.6,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      // fieldNormWeight: 1,
      keys: ['title', 'author.firstName']
    }

    const fuse = new Fuse(JSON.parse(jsonData.value), fuseOptions)

    const stopwatch = new Stopwatch()

    const result = fuse.search(searchPattern.value)

    count.value = result.length
    searchTime.value = Math.floor(stopwatch.stop().duration)
    resultsData.value = JSON.stringify(result, null, 2)
  } catch {
    count.value = null
    searchTime.value = null
    resultsData.value = JSON.stringify({}, null, 2)
  }
}

// function onCmCodeChange(newCode) {
//   code.value = newCode
//   try {
//     parse()
//     update()
//   } catch (err) {}
// }

// function onCmListChange(newCode) {
//   try {
//     list.value = eval(newCode)
//     listErrorMessage.value = null
//     hasErrors.value = !!codeErrorMessage.value
//     update()
//   } catch (err) {
//     listErrorMessage.value = err
//     hasErrors.value = true
//     outputHtml.value = ''
//     throw err
//   }
// }

// function update() {
//   if (hasErrors.value) {
//     return
//   }
//   const html = Prism.highlight(
//     JSON.stringify(result.value, null, 2),
//     Prism.languages.json,
//     'json'
//   )
//   count.value = result.value.length
//   outputHtml.value = html
// }

// onMounted(() => {
//   // parse()
//   // update()
// })
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
