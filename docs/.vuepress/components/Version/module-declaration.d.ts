declare module '@vuepress/plugin-theme-data/client' {
  import type { DefaultThemeData } from '@vuepress/theme-default'
  import type { Ref } from 'vue'

  export declare function useThemeData(): Ref<DefaultThemeData>
}
