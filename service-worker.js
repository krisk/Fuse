// Kill-switch service worker.
//
// fusejs.io previously shipped @vuepress/plugin-pwa, which registered a
// service worker at /service-worker.js. After dropping PWA in the VitePress
// migration, returning visitors still have the old SW + caches active.
// This empty SW unregisters itself and clears all caches on first activate,
// so existing browsers self-evict on next visit.

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((name) => caches.delete(name)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((client) => client.navigate(client.url))
    })()
  )
})
