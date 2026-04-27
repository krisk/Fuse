import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import Layout from './Layout.vue'
import './style.css'

import ArchitectureDiagram from './components/ArchitectureDiagram.vue'
import BitapDemo from './components/BitapDemo.vue'
import CommercialCTA from './components/CommercialCTA.vue'
import FuzzyMatchDemo from './components/FuzzyMatchDemo.vue'
import PerfDemo from './components/PerfDemo.vue'
import Playground from './components/Playground.vue'
import PublishDate from './components/PublishDate.vue'
import SearchWindowDemo from './components/SearchWindowDemo.vue'
import Sponsor from './components/Sponsor.vue'
import Sponsors from './components/Sponsors.vue'
import ThresholdDemo from './components/ThresholdDemo.vue'
import UsedBy from './components/UsedBy.vue'
import WorkerDemo from './components/WorkerDemo.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ArchitectureDiagram', ArchitectureDiagram)
    app.component('BitapDemo', BitapDemo)
    app.component('CommercialCTA', CommercialCTA)
    app.component('FuzzyMatchDemo', FuzzyMatchDemo)
    app.component('PerfDemo', PerfDemo)
    app.component('Playground', Playground)
    app.component('PublishDate', PublishDate)
    app.component('SearchWindowDemo', SearchWindowDemo)
    app.component('Sponsor', Sponsor)
    app.component('Sponsors', Sponsors)
    app.component('ThresholdDemo', ThresholdDemo)
    app.component('UsedBy', UsedBy)
    app.component('WorkerDemo', WorkerDemo)

    if (typeof window !== 'undefined') {
      ;(self as unknown as { MonacoEnvironment: unknown }).MonacoEnvironment = {
        getWorker(_: unknown, label: string) {
          if (label === 'json') {
            return new Worker(
              new URL('monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url),
              { type: 'module' }
            )
          }
          if (label === 'typescript' || label === 'javascript') {
            return new Worker(
              new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
              { type: 'module' }
            )
          }
          return new Worker(
            new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
            { type: 'module' }
          )
        }
      }
    }
  }
} satisfies Theme
