import { pwaPlugin } from '@vuepress/plugin-pwa'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import {
  defineUserConfig,
  HeadAttrsConfig,
  HeadTagNonEmpty,
  PluginConfig,
  SidebarConfigArray,
  type HeadConfig,
  type HeadTagEmpty
} from 'vuepress'

import { defaultTheme } from '@vuepress/theme-default'

import tabsPlugin from '@snippetors/vuepress-plugin-tabs'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'

const GA_MEASUREMENT_ID = 'UA-82107035-1'
const GOOGLE_SITE_VERIFICATION = '4nm40QLVcDJmEJSAbrMfZ7fpBJZIXL1oSngBAYrZopY'
//const GOOGLE_AD_CLIENT_ID = 'ca-pub-3734944050099256'

export default defineUserConfig({
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Fuse.js',
      description: 'Lightweight fuzzy-search library, in JavaScript'
    }
  },
  head: getHead(),
  plugins: getPlugins(),
  theme: defaultTheme({
    logo: '/assets/img/logo.png',
    repo: 'krisk/fuse',
    docsDir: 'docs',
    docsBranch: 'master',
    sidebarDepth: 6,
    sidebar: [...getGuideSidebar()]
  })
})

function getGuideSidebar(): SidebarConfigArray {
  return [
    {
      text: 'Getting Started',
      children: [
        '/getting-started/installation',
        '/getting-started/different-builds'
      ]
    },
    '/demo',
    {
      text: 'API Reference',
      children: [
        '/api/options',
        '/api/config',
        '/api/methods',
        '/api/indexing',
        '/api/query'
      ]
    },
    '/examples',
    {
      text: 'Concepts',
      children: ['/concepts/scoring-theory']
    }
  ]
}

function getComponent(name: string): Record<string, string> {
  return {
    [name]: `${__dirname}/components/${name}/${name}.vue`
  }
}

function getPlugins(): PluginConfig {
  return [
    // [
    //   'vuepress-plugin-google-adsense2',
    //   {
    //     id: GOOGLE_AD_CLIENT_ID,
    //   },
    // ],
    googleAnalyticsPlugin({
      id: GA_MEASUREMENT_ID
    }),
    tabsPlugin({}),
    registerComponentsPlugin({
      components: {
        ...getComponent('Stories'),
        ...getComponent('Sponsors'),
        ...getComponent('Demo'),
        ...getComponent('Team'),
        ...getComponent('Jobs'),
        ...getComponent('Donate'),
        ...getComponent('TwitterFollow')
      }
    }),
    pwaPlugin()
  ]
}

function getHead(): HeadConfig[] {
  const appleTouchIcons: [HeadTagEmpty, HeadAttrsConfig][] = [
    '57x57',
    '60x60',
    '72x72',
    '76x76',
    '114x114',
    '120x120',
    '144x144',
    '152x152',
    '180x180'
  ].flatMap<[HeadTagEmpty, HeadAttrsConfig]>((size) => [
    'link',
    { rel: 'apple-touch-icon', size, href: `/icons/apple-icon-${size}.png` }
  ])

  const sizedIcons: [HeadTagEmpty, HeadAttrsConfig][] = [
    {
      size: '192x192',
      href: 'android-icon-192x192.png'
    },
    { size: '32x32', href: 'favicon-32x32.png' },
    { size: '96x96', href: 'favicon-96x96.png' },
    { size: '16x16', href: 'favicon-16x16.png' }
  ].flatMap<[HeadTagEmpty, HeadAttrsConfig]>(({ size, href }) => [
    'link',
    { rel: 'icon', type: 'image/png', size, href: `/icons/${href}` }
  ])

  const meta: [HeadTagEmpty, HeadAttrsConfig][] = [
    { name: 'msapplication-TileColor', content: '#ffffff' },
    { name: 'msapplication-TileImage', content: '/icons/ms-icon-144x144.png' },
    { name: 'theme-color', content: '#ffffff' },
    {
      name: 'google-site-verification',
      content: GOOGLE_SITE_VERIFICATION
    }
  ].flatMap<[HeadTagEmpty, HeadAttrsConfig]>(({ name, content }) => [
    'meta',
    { name, content }
  ])

  const scripts: [HeadTagNonEmpty, HeadAttrsConfig, string][] = [
    `
      (function(){
        var bsa_optimize=document.createElement('script');
        bsa_optimize.type='text/javascript';
        bsa_optimize.async=true;
        bsa_optimize.src='https://cdn4.buysellads.net/pub/fusejs.js?'+(new Date()-new Date()%600000);
        (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(bsa_optimize);
      })();
      `
  ].flatMap<[HeadTagNonEmpty, HeadAttrsConfig, string]>((content) => [
    'script',
    {},
    content
  ])

  return [
    ...appleTouchIcons,
    ...sizedIcons,
    ...meta,
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ...scripts
  ]
}
