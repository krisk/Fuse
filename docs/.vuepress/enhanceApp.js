export default ({ router }) => {
  router.addRoutes([
    {
      path: '/ads.txt',
      beforeEnter(to, from, next) {
        window.location.replace('https://cdn4.buysellads.net/ads.txt')
      }
    },
    {
      path: '/app-ads.txt',
      beforeEnter(to, from, next) {
        window.location.replace('https://cdn4.buysellads.net/app-ads.txt')
      }
    }
  ])
}
