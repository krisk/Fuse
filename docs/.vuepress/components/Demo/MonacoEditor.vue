<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { defineProps, onMounted, ref } from 'vue'

const editorRef = ref()
const props = defineProps<{
  language: string
  value: any
  id: string
  fileName: string
  fileDescription: string
  readonly?: boolean
}>()

onMounted(() => {
  monaco.editor.create(editorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    selectOnLineNumbers: true,
    wordWrap: 'on',
    wrappingStrategy: 'advanced',
    minimap: {
      enabled: false
    },
    autoClosingQuotes: 'always',
    bracketPairColorization: {
      enabled: true
    },
    colorDecorators: true,
    cursorBlinking: 'expand',
    cursorSmoothCaretAnimation: true,
    fontLigatures: true,
    fontFamily:
      '"Fira Code", "JetBrains Mono", "Menlo", "Monaco", "Consolas", "Courier New", "monospace"',
    formatOnPaste: true,
    guides: {
      bracketPairs: true
    },
    theme: 'vs-dark',
    smartSelect: {
      selectLeadingAndTrailingWhitespace: true
    },
    tabCompletion: 'on',
    useShadowDOM: true,
    scrollBeyondLastLine: false,
    ...(props.readonly && {
      readOnly: true,
      contextmenu: false
    })
  })
})
</script>

<template>
  <div class="header">
    <div>{{ props.fileName }}</div>
    <div>{{ props.fileDescription }}</div>
  </div>
  <div :id="props.id" class="editor" ref="editorRef"></div>
</template>

<style scoped>
.editor {
  height: 35vh;
}

.header {
  align-items: center;
  background: #ffffff;
  border: solid 1px #ffffff;
  display: flex;
  height: 30px;
  justify-content: space-between;
  padding: 0px 1%;
  width: 97.5%;
}

html.dark .header {
  background: #1e1e1e;
  border: solid 1px #3c3c3c;
}
</style>
