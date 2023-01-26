import { defineClientConfig } from '@vuepress/client'

export default defineClientConfig({
  enhance({ router }) {
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
