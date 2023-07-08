import { defineClientConfig } from '@vuepress/client'
import Layout from './layouts/Layout.vue'

// @ts-expect-error monaco editor doesn't have types for the workers
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-expect-error monaco editor doesn't have types for the workers
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-expect-error monaco editor doesn't have types for the workers
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

export default defineClientConfig({
  layouts: {
    Layout
  },
  enhance({ router }) {
    if (!__VUEPRESS_SSR__) {
      self.MonacoEnvironment = {
        getWorker(_, label) {
          switch (label) {
            case 'json':
              return new jsonWorker()
            case 'typescript':
            case 'javascript':
              return new tsWorker()
            default:
              return editorWorker()
          }
        }
      }
    }

    router.addRoute('/', {
      path: '/ads.txt',
      redirect: '',
      beforeEnter: () => {
        window.location.replace('https://cdn4.buysellads.net/ads.txt')
      }
    })

    router.addRoute('/', {
      path: '/app-ads.txt',
      redirect: '',
      beforeEnter: () => {
        window.location.replace('https://cdn4.buysellads.net/app-ads.txt')
      }
    })
  }
})

declare global {
  const __VUEPRESS_SSR__: boolean
  const _bsa: any

  interface Window {
    MonacoEnvironment?: import('monaco-editor').Environment | undefined
  }
}
