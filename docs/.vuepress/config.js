const pckg = require('../../package.json')
const VERSION = process.env.VERSION || pckg.version
const GA_MEASUREMENT_ID = 'UA-82107035-1'

module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Fuse.js',
      description: 'Lightweight fuzzy-search library, in JavaScript'
    }
  },
  head: getHead(),
  plugins: getPlugins(),
  serviceWorker: true,
  themeConfig: {
    logo: '/assets/img/logo.png',
    repo: 'krisk/fuse',
    base: 'docs',
    lastUpdated: 'Last Updated',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    version: VERSION,
    GA_MEASUREMENT_ID,
    displayAllHeaders: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: require('./nav/en'),
        sidebar: {
          // '/blog': getBlogSidebar(),
          '/': getGuideSidebar()
        }
      }
    }
  }
}

function getGuideSidebar() {
  return [
    {
      title: 'Getting Started',
      collapsable: false,
      // sidebarDepth: 0,
      children: [
        '/getting-started/installation',
        '/getting-started/different-builds'
      ]
    },
    '/demo',
    {
      title: 'API Reference',
      collapsable: false,
      children: ['/api/options', 'api/config', '/api/indexing', 'api/query']
    },
    '/examples',
    {
      title: 'Concepts',
      collapsable: false,
      children: ['/concepts/scoring-theory']
    }
  ]
}

// function getBlogSidebar() {
//   return []
// }

function getPlugins() {
  return [
    require('./plugins/google-analytics'),
    'vuepress-plugin-smooth-scroll',
    'vuepress-plugin-element-tabs',
    [
      'social-share',
      {
        networks: ['twitter', 'facebook', 'reddit', 'email', 'linkedin'],
        extendsNetworks: {
          email: {
            sharer: 'mailto:?subject=@title&body=@url%0D%0A%0D%0A@description',
            type: 'direct',
            icon: '/assets/img/email.png'
          },
          linkedin: {
            sharer:
              'https://www.linkedin.com/sharing/share-offsite/?mini=true&url=@url&title=@title&summary=@description',
            type: 'popup',
            color: '#1786b1',
            icon:
              '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>'
          }
        },
        twitterUser: 'kirorisk',
        autoQuote: true,
        isPlain: false,
        noGlobalSocialShare: true
      }
    ]
  ]
}

function getHead() {
  const appleTouchIcons = [
    { sizes: '57x57', href: 'apple-icon-57x57.png' },
    { sizes: '60x60', href: 'apple-icon-60x60.png' },
    { sizes: '72x72', href: 'apple-icon-72x72.png' },
    { sizes: '76x76', href: 'apple-icon-76x76.png' },
    { sizes: '114x114', href: 'apple-icon-114x114.png' },
    { sizes: '120x120', href: 'apple-icon-120x120.png' },
    { sizes: '144x144', href: 'apple-icon-144x144.png' },
    { sizes: '152x152', href: 'apple-icon-152x152.png' },
    { sizes: '180x180', href: 'apple-icon-180x180.png' }
  ].map(({ sizes, href }) => [
    'link',
    { rel: 'apple-touch-icon', sizes, href: `/icons/${href}` }
  ])

  const sizedIcons = [
    {
      sizes: '192x192',
      href: 'android-icon-192x192.png'
    },
    { sizes: '32x32', href: 'favicon-32x32.png' },
    { sizes: '96x96', href: 'favicon-96x96.png' },
    { sizes: '16x16', href: 'favicon-16x16.png' }
  ].map(({ sizes, href }) => [
    'link',
    { rel: 'icon', type: 'image/png', sizes, href: `/icons/${href}` }
  ])

  const meta = [
    { name: 'msapplication-TileColor', content: '#ffffff' },
    { name: 'msapplication-TileImage', content: '/icons/ms-icon-144x144.png' },
    { name: 'theme-color', content: '#ffffff' },
    {
      name: 'google-site-verification',
      content: '4nm40QLVcDJmEJSAbrMfZ7fpBJZIXL1oSngBAYrZopY'
    }
  ].map(({ name, content }) => ['meta', { name, content }])

  return [
    ...appleTouchIcons,
    ...sizedIcons,
    ...meta,
    ['link', { rel: 'manifest', href: '/icons/manifest.json' }]
  ]
}
