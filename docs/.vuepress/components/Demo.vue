<template>
  <div class="demo-app">
    <h3>List</h3>
    <div class="list-container">
      <span class="commands command" @click="resetList">[reset]</span>
      <textarea v-model="listJSON" @change="onListChange" />
      <span class="error-msg">{{ listErrorMessage }}</span>
    </div>
    <h3>Options</h3>
    <div class="row">
      <div class="col-4">
        <strong>Basic options</strong>
        <ul>
          <li v-for="item in booleans" :key="item">
            <input
              :id="item"
              type="checkbox"
              :checked="options[item]"
              @change="onCheckboxOptionChange"
            />
            <label :for="item">
              <code>{{ item }}</code>
            </label>
          </li>
          <li>
            <label class="option-label" for="minMatchCharLength">
              <code>minMatchCharLength</code> :
            </label>
            <input
              id="minMatchCharLength"
              type="number"
              min="0"
              max="32"
              :value="options.minMatchCharLength"
              @change="onInputChange"
            />
          </li>
        </ul>
      </div>
      <div class="col-4">
        <strong>Fuzzy matching options</strong>
        <ul>
          <li v-for="item in numbers" :key="item.name">
            <label class="option-label" for="item.name">
              <code>{{ item.name }}</code> :
            </label>
            <input
              :id="item.name"
              type="number"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              :value="options[item.name]"
              @change="onInputChange"
            />
          </li>
        </ul>
      </div>
      <div class="col-4">
        <strong>Advanced options</strong>
        <ul>
          <li>
            <input
              id="useExtendedSearch"
              type="checkbox"
              :checked="options.useExtendedSearch"
              @change="onCheckboxOptionChange"
            />
            <label for="useExtendedSearch">
              <code>useExtendedSearch</code>
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div v-bind:class="{ largeKeysTextbox: keyMode === 'weighted' }">
      <label for="keysTextbox"> <code>keys</code></label>
      <span class="commands">
        [Try:
        <span
          :class="['command', { keyModeActive: keyMode === 'normal' }]"
          @click="changeKeyMode('normal')"
        >
          normal
        </span>
        <span>|</span>
        <span
          :class="['command', { keyModeActive: keyMode === 'weighted' }]"
          @click="changeKeyMode('weighted')"
        >
          weighted
        </span>
        ]
      </span>
      <textarea id="keysTextbox" v-model="keysJSON" @change="onKeysChange" />
      <span class="error-msg">{{ keyErrorMessage }}</span>
    </div>
    <h3>Code</h3>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <pre><code v-html="codeHtml"></code></pre>
    <div>
      <label for="searchTextbox">Search: </label>
      <input
        id="searchTextbox"
        type="search"
        placeholder="Old man's war, etc..."
        @keyup="onPatternKeyUp"
        @change="onPatternChange"
      />
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <pre><code v-html="queryHtml"></code></pre>
    <h3>Results</h3>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <pre><code v-html="outputHtml"></code></pre>
  </div>
</template>

<!-- eslint-disable-next-line vue/component-tags-order-->
<script>
/* global gtag globalThis */

import Fuse from '../../../dist/fuse.esm.js'
import Books from './books.js'
import Prism from 'prismjs'
import 'prismjs/components/prism-json' // need this

function send(label) {
  if (process.env.NODE_ENV === 'production' && !!globalThis.gtag) {
    gtag('event', 'change', {
      event_category: 'Demo',
      event_label: label
    })
  }
}

const KeyModeDefault = {
  normal: ['title', 'author.firstName'],
  weighted: [
    {
      name: 'title',
      weight: 0.7
    },
    {
      name: 'author.firstName',
      weight: 0.3
    }
  ]
}

const booksJSON = JSON.stringify(Books, null, 2)

export default {
  name: 'Demo',
  data: () => ({
    defaults: Fuse.defaultOptions,
    list: Books,
    listJSON: booksJSON,
    booleans: [
      'isCaseSensitive',
      'includeScore',
      'includeMatches',
      'shouldSort',
      'findAllMatches'
    ],
    numbers: [
      { name: 'location', min: 0, max: 100, step: 1 },
      { name: 'threshold', min: 0, max: 1, step: 0.1 },
      { name: 'distance', min: 0, max: 1000, step: 1 }
    ],
    options: {
      ...Fuse.defaultOptions,
      keys: KeyModeDefault.normal
    },
    keysJSON: JSON.stringify(KeyModeDefault.normal, null, 2),
    keyMode: 'normal',
    codeHtml: '',
    queryHtml: '',
    pattern: '',
    outputHtml: '',
    keyErrorMessage: '',
    listErrorMessage: ''
  }),
  mounted: function () {
    this.$nextTick(this.update)
  },
  methods: {
    onCheckboxOptionChange(event) {
      let isChecked = event.target.checked
      this.options[event.target.id] = isChecked
      send(`option:${event.target.id}`)
      this.update()
    },
    onKeysChange(event) {
      try {
        let keys = JSON.parse(event.target.value)
        this.options.keys = keys
        this.$set(this, 'keysJSON', JSON.stringify(keys, null, 2))
        this.update()
        this.keyErrorMessage = ''
        send(`option:keys`)
      } catch (err) {
        this.keyErrorMessage = err
      }
    },
    changeKeyMode(mode) {
      let keys = JSON.stringify(KeyModeDefault[mode], null, 2)
      this.options.keys = KeyModeDefault[mode]
      this.$set(this, 'keysJSON', keys)
      this.$set(this, 'keyMode', mode)
      this.update()
      this.keyErrorMessage = ''
    },
    onInputChange(event) {
      this.options[event.target.id] = Number(event.target.value)
      this.update()
      send(`option:${event.target.id}`)
    },
    onPatternChange() {
      send(`search`)
    },
    onPatternKeyUp(event) {
      this.pattern = event.target.value
      this.updateQuery()
    },
    onListChange() {
      try {
        this.$set(this, 'list', JSON.parse(this.listJSON))
        this.listErrorMessage = ''
        this.update()
      } catch (err) {
        this.listErrorMessage = err
      }
    },
    resetList() {
      this.$set(this, 'list', Books)
      this.$set(this, 'listJSON', booksJSON)
      this.update()
    },
    update() {
      let arr = []
      arr.push('const options = {')

      const keys = Object.keys(this.options)
      for (var key of keys) {
        let value = this.options[key]
        if (
          typeof value == 'number' ||
          typeof value == 'boolean' /* && value !== DEFAULT_OPTIONS[key]*/
        ) {
          arr.push(`  ${key}: ${value},`)
        }
      }

      if (this.options.keys) {
        arr.push('  keys: [')
        // remove the first bracket, sicne we put it above
        let lines = this.keysJSON.split('\n').slice(1)
        lines.forEach((line) => {
          arr.push('  ' + line)
        })
      }
      arr.push('}')
      arr.push('')
      arr.push('const fuse = new Fuse(list, options)')
      arr = arr.join('\n')
      const html = Prism.highlight(
        arr,
        Prism.languages.javascript,
        'javascript'
      )

      this.codeHtml = html
      this.updateQuery()
    },
    updateQuery() {
      let query = `const result = fuse.search("${this.pattern}");`
      const html = Prism.highlight(
        query,
        Prism.languages.javascript,
        'javascript'
      )
      this.queryHtml = html
      this.updateOutput()
    },
    updateOutput() {
      const fuse = new Fuse(this.list, this.options)
      let result = fuse.search(this.pattern)
      const html = Prism.highlight(
        JSON.stringify(result, null, 2),
        Prism.languages.json,
        'json'
      )
      this.outputHtml = html
    }
  }
}
</script>

<style lang="stylus">
.demo-app {
  input, textarea {
    font: inherit;
    line-height: normal;
  }
  ul {
    list-style-type: none;
    padding: 0px;
    li {
      margin: 2px 0px;
    }
  }

  .commands {
    float: right
  }

  .command {
    cursor pointer
    color: #2c3e50
  }

  .keyModeActive {
    font-weight 700
  }

  .list-container {
    textarea {
      width: 100%
      height: 300px
    }
  }
}

#keysTextbox {
  margin-top: 10px
  min-width: 100%;
  min-height: 85px;
}

.largeKeysTextbox {
  #keysTextbox {
    min-height: 200px;
  }
}

.error-msg {
  color: red;
}
</style>
