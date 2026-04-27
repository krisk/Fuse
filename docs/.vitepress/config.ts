import { defineConfig, type HeadConfig } from 'vitepress'
import { version } from '../../package.json'

const SITE_URL = 'https://www.fusejs.io'
const GA_MEASUREMENT_ID = 'G-78VK1PFWH1'
const GOOGLE_SITE_VERIFICATION = '4nm40QLVcDJmEJSAbrMfZ7fpBJZIXL1oSngBAYrZopY'

export default defineConfig({
  lang: 'en-US',
  title: 'Fuse.js',
  description: 'Lightweight fuzzy-search library, in JavaScript',

  cleanUrls: false,

  sitemap: {
    hostname: SITE_URL
  },

  head: getHead(),

  themeConfig: {
    logo: '/assets/img/logo.png',

    nav: [
      { text: 'Docs', link: '/' },
      { text: 'Demo', link: '/demo' },
      { text: 'Sponsor', link: '/sponsor' },
      { text: 'Cloud', link: '/cloud' }
    ],

    sidebar: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Fuzzy Search', link: '/fuzzy-search' },
      { text: 'Token Search', link: '/token-search' },
      { text: 'Extended Search', link: '/extended-search' },
      { text: 'Logical Search', link: '/logical-search' },
      { text: 'Web Workers', link: '/web-workers' },
      { text: 'Performance', link: '/performance' },
      {
        text: 'Articles',
        items: [
          { text: 'Using Fuse with React', link: '/articles/using-fuse-with-react' },
          { text: 'vs Semantic Search', link: '/articles/vs-semantic-search' },
          { text: 'How Fuzzy Search Works', link: '/articles/how-fuzzy-search-works' }
        ]
      }
    ],

    outline: { level: [2, 3], label: 'On this page' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/krisk/fuse' },
      { icon: 'x', link: 'https://x.com/kirorisk' }
    ],

    search: {
      provider: 'local'
    },

    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },

    editLink: undefined
  },

  markdown: {
    theme: { light: 'github-dark', dark: 'github-dark' }
  },

  vite: {
    server: { port: 3000, strictPort: true },
    optimizeDeps: {
      include: ['monaco-editor']
    }
  }
})

function getHead(): HeadConfig[] {
  const appleTouchIcons: HeadConfig[] = [
    '57x57',
    '60x60',
    '72x72',
    '76x76',
    '114x114',
    '120x120',
    '144x144',
    '152x152',
    '180x180'
  ].map((size) => [
    'link',
    { rel: 'apple-touch-icon', size, href: `/icons/apple-icon-${size}.png` }
  ])

  const sizedIcons: HeadConfig[] = [
    { size: '192x192', href: 'android-icon-192x192.png' },
    { size: '32x32', href: 'favicon-32x32.png' },
    { size: '96x96', href: 'favicon-96x96.png' },
    { size: '16x16', href: 'favicon-16x16.png' }
  ].map(({ size, href }) => [
    'link',
    { rel: 'icon', type: 'image/png', size, href: `/icons/${href}` }
  ])

  const meta: HeadConfig[] = [
    ['meta', { name: 'msapplication-TileColor', content: '#ffffff' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/ms-icon-144x144.png' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'google-site-verification', content: GOOGLE_SITE_VERIFICATION }]
  ]

  const og: HeadConfig[] = [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Fuse.js' }],
    ['meta', { property: 'og:title', content: 'Fuse.js — Lightweight Fuzzy-Search Library' }],
    ['meta', { property: 'og:description', content: 'Powerful, lightweight fuzzy-search library for JavaScript with zero dependencies.' }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/assets/img/logo.png` }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:site', content: '@kirorisk' }],
    ['meta', { name: 'twitter:title', content: 'Fuse.js — Lightweight Fuzzy-Search Library' }],
    ['meta', { name: 'twitter:description', content: 'Powerful, lightweight fuzzy-search library for JavaScript with zero dependencies.' }],
    ['meta', { name: 'twitter:image', content: `${SITE_URL}/assets/img/logo.png` }]
  ]

  const ga: HeadConfig[] = [
    ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}` }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`
    ]
  ]

  return [
    ...appleTouchIcons,
    ...sizedIcons,
    ...meta,
    ...og,
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ...ga
  ]
}
