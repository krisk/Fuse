/* global GA_MEASUREMENT_ID */

export default ({ router, siteData }) => {
  const { GA_MEASUREMENT_ID } = siteData.themeConfig

  if (
    process.env.NODE_ENV === 'production' &&
    GA_MEASUREMENT_ID &&
    typeof window !== 'undefined'
  ) {
    let head = document.getElementsByTagName('script')[0]
    let script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    head.parentNode.insertBefore(script, head)

    window.dataLayer = window.dataLayer || []

    function gtag() {
      dataLayer.push(arguments)
    }

    window.gtag = gtag

    router.afterEach(function (to) {
      gtag('js', new Date())
      gtag('config', GA_MEASUREMENT_ID, { page_path: to.fullPath })
    })
  }
}
