<script setup lang="ts">
import loader from '@monaco-editor/loader'
import { isFunction } from '@sapphire/utilities'
import * as Monaco from 'monaco-editor'
import { computed, onMounted, ref, watch } from 'vue'

interface Emits {
  (event: 'update:modelValue', value: string): void
  (event: 'load', editor: Monaco.editor.IStandaloneCodeEditor): void
}

const props = defineProps<{
  language: string
  modelValue: string
  id: string
  fileName: string
  fileDescription: string
  readonly?: boolean
}>()

const loadedMonaco = isFunction(loader.init) ? await loader.init() : undefined

const emit = defineEmits<Emits>()
const isLoading = ref(true)
const lang = computed(() => props.language)
const editorElement = ref<HTMLDivElement>()
const monaco = ref(loadedMonaco)

let editor: Monaco.editor.IStandaloneCodeEditor
let model: Monaco.editor.ITextModel
const editorRef = ref()

watch(
  () => props.modelValue,
  () => {
    if (editor?.getValue() !== props.modelValue) {
      editor?.setValue(props.modelValue)
    }
  }
)

watch(
  () => props.language,
  () => {
    if (model) {
      model.dispose()
    }
    model = monaco.value.editor.createModel(props.modelValue, lang.value)
    editor?.setModel(model)
  }
)

defineExpose({
  /**
   * Monaco editor instance
   */
  $editor: editorRef
})

onMounted(() => {
  editor = monaco.value.editor.create(editorElement.value, {
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

  editorRef.value = editor
  model = monaco.value.editor.createModel(props.modelValue, lang.value)
  editor.setModel(model)
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue())
  })
  isLoading.value = false
  emit('load', editor)
})
</script>

<template>
  <div class="header">
    <div>{{ props.fileName }}</div>
    <div>{{ props.fileDescription }}</div>
  </div>
  <div :id="props.id" class="editor" ref="editorElement">
    <slot v-if="isLoading" />
  </div>
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
