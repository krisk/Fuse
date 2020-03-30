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
    <!-- <span class="error-msg">{{ listErrorMessage }}</span> -->
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
        @ready="onCmReady"
        @focus="onCmFocus"
        @input="onCmCodeChange"
      />
    </article>
    <!-- <span class="error-msg">{{ codeErrorMessage }}</span> -->
    <h3></h3>
    <article class="code-container">
      <span class="header"
        ><b>Results:</b> found {{ count }} items in {{ searchTime }}</span
      >
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

const code = `const options = {
  isCaseSensitive: false,
  findAllMatches: false,
  includeMatches: false,
  includeScore: false,
  useExtendedSearch: false,
  minMatchCharLength: 1,
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  keys: [
    "title",
    "author.firstName"
  ]
};

const fuse = new Fuse(list, options);

// Change the query
const query = "old"

return fuse.search(query)`

export default {
  name: 'Demo',
  components: {
    codemirror
  },
  data: () => ({
    listJSON: JSON.stringify(Books, null, 2),
    list: Books,
    code,
    result: '',
    outputHtml: '',
    count: 0,
    searchTime: 0,
    listErrorMessage: '',
    codeErrorMessage: '',
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
    onCmReady(cm) {
      // console.log('the editor is readied!', cm)
    },
    onCmFocus(cm) {
      // console.log('the editor is focused!', cm)
    },
    onCmCodeChange(newCode) {
      // console.log('this is new code', newCode)
      this.code = newCode
      try {
        this.parse()
        this.update()
      } catch (err) {
        console.error(err)
      }
    },
    onCmListChange(newCode) {
      try {
        this.list = eval(newCode)
        this.update()
        this.listErrorMessage = ''
      } catch (err) {
        this.listErrorMessage = err
      }
    },
    parse() {
      try {
        const func = () => {
          let body = `(Fuse, list) => {${this.code}}`
          return eval(body)(Fuse, this.list)
        }
        let start = new Date().getTime()
        this.result = func()
        let end = new Date().getTime()
        this.searchTime = end - start + ' ms'
        this.codeErrorMessage = null
      } catch (err) {
        this.codeErrorMessage = err
      }
    },
    update() {
      const html = Prism.highlight(
        JSON.stringify(this.result, null, 2),
        Prism.languages.json,
        'json'
      )
      this.count = this.result.length
      this.outputHtml = html
    }
  },
  computed: {
    codemirror() {
      return this.$refs.cmEditor.codemirror
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
  margin-top: 5px;
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
</style>
