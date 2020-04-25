<template>
  <div class="live-demo">
    <article class="code-container">
      <span class="header">
        <span>list.json</span>
        <span class="instruction">(list of items to search)</span>
      </span>
      <codemirror
        class="cm-list-editor"
        ref="listEditor"
        :value="listJSON"
        :options="listOptions"
        @input="onCmListChange"
      />
    </article>
    <span v-if="listErrorMessage" class="error-msg">
      {{ listErrorMessage }}
    </span>

    <section class="search-section">
      <input
        type="text"
        v-model="pattern"
        @keyup="onPatternKeyUp"
        placeholder="Search..."
      />
      <!-- <label class="toggle-code" @click="toggleCode">
        {{ showCode ? '[hide code]' : '[show code]' }}
      </label> -->
    </section>

    <div v-if="showCode">
      <Content slot-key="middle" />
      <article class="code-container">
        <span class="header">
          <span>main.js</span>
          <span class="instruction">(entry module)</span>
        </span>
        <codemirror
          ref="cmEditor"
          class="cm-code-editor"
          :value="code"
          :options="cmOptions"
          @input="onCmCodeChange"
        />
      </article>
      <span v-if="codeErrorMessage" class="error-msg">
        {{ codeErrorMessage }}
      </span>
    </div>
    <article class="code-container">
      <span class="header">
        <span v-if="!hasErrors">
          <b>Results:</b> found {{ count }} items in {{ searchTime }}
        </span>
        <span v-else>--</span>
      </span>
      <pre class="output"><code v-html="outputHtml"></code></pre>
    </article>
  </div>
</template>

<script>
import Fuse from '../../../dist/fuse.esm.js'
import Books from './books.js'

import Prism from 'prismjs'
import 'prismjs/components/prism-json'

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/monokai.css'

let keys = []
for (const key in Fuse.config) {
  if (typeof Fuse.config[key] != 'function' && key !== 'keys') {
    keys.push(key)
  }
}

let codify = (pattern) => {
  return `const options = {
${keys.map((key) => `  // ${key}: ${Fuse.config[key]},`).join('\n')}
  keys: [
    "title",
    "author.firstName"
  ]
};

const fuse = new Fuse(list, options);

// Change the pattern
const pattern = "${pattern}"

return fuse.search(pattern)`
}

// Purely here to make two-way binding possible:
// Extend Fuse such that we can expose the pattern that was
// modified direclty in the CodeMirror input.
class DemoFuse extends Fuse {
  constructor(list, options, index) {
    super(list, options, index)
  }
  search(pattern, opts = { limit: false }) {
    const results = super.search(pattern, opts)
    return { pattern, results }
  }
}

export default {
  name: 'Demo',
  components: {
    codemirror
  },
  data: () => ({
    listJSON: JSON.stringify(Books, null, 2),
    list: Books,
    code: codify(''),
    result: '',
    outputHtml: '',
    count: 0,
    searchTime: 0,
    listErrorMessage: '',
    codeErrorMessage: '',
    hasErrors: false,
    pattern: '',
    showCode: true,
    listOptions: {
      tabSize: 2,
      mode: 'text/javascript',
      theme: 'default',
      lineNumbers: true,
      line: true
    },
    cmOptions: {
      tabSize: 2,
      mode: 'text/javascript',
      theme: 'default',
      lineNumbers: true,
      line: true
    }
  }),
  methods: {
    toggleCode() {
      this.showCode = !this.showCode
    },
    onCmCodeChange(newCode) {
      this.code = newCode
      try {
        this.parse()
        this.update()
      } catch (err) {}
    },
    onCmListChange(newCode) {
      try {
        this.list = eval(newCode)
        this.listErrorMessage = null
        this.hasErrors = !!this.codeErrorMessage
        this.update()
      } catch (err) {
        this.listErrorMessage = err
        this.hasErrors = true
        this.outputHtml = ''
        throw err
      }
    },
    parse() {
      try {
        let func = eval(`[function (Fuse, list){${this.code}}][0]`)

        let start = new Date().getTime()
        const { pattern, results } = func(DemoFuse, this.list)
        this.result = results
        this.pattern = pattern
        let end = new Date().getTime()
        this.searchTime = end - start + ' ms'
        this.codeErrorMessage = null
        this.hasErrors = !!this.listErrorMessage
      } catch (err) {
        this.codeErrorMessage = err
        this.hasErrors = true
        this.outputHtml = ''
        throw err
      }
    },
    update() {
      if (this.hasErrors) {
        return
      }
      const html = Prism.highlight(
        JSON.stringify(this.result, null, 2),
        Prism.languages.json,
        'json'
      )
      this.count = this.result.length
      this.outputHtml = html
    },
    onPatternKeyUp() {
      this.code = codify(this.pattern)
    }
  },
  mounted() {
    this.parse()
    this.update()
  }
}
</script>

<style lang="css">
.live-demo .code-container {
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.live-demo .code-container .header {
  display: block;
  padding: 0.5em;
  border-bottom: 1px solid #f4f4f4;
  color: #555;
  position: relative;
}

.live-demo .code-container .header .instruction {
  color: #555;
  opacity: 0.6;
  position: absolute;
  right: 0;
  padding-right: 0.5em;
}

.live-demo .CodeMirror {
  height: 100%;
  border-radius: 3px;
  font-family: Inconsolata, monospace;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 400;
  color: #333;
}
.live-demo .cm-list-editor {
  height: 250px;
}
.live-demo .error-msg {
  margin: 5px 0px;
  color: red;
  display: inline-block;
}
.live-demo .output {
  max-height: 300px;
  border-radius: 3px;
  background: white;
  font-family: Inconsolata, monospace;
  font-size: 16px;
  line-height: 1.2;
}

.live-demo .output .token.punctuation,
.live-demo .output .token.operator {
  color: #333;
}

.live-demo .output .token.property,
.live-demo .output .token.string,
.live-demo .output .token.number,
.live-demo .output .token.comment,
.live-demo .output .token.prolog,
.live-demo .output .token.doctype,
.live-demo .output .token.cdata {
  color: #a11 !important;
}

.live-demo .search-section {
  margin-bottom: 20px;
}
.live-demo .search-section input {
  font-size: 16px;
}
.live-demo .toggle-code {
  cursor: pointer;
}
</style>
