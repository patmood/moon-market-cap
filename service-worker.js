const cacheName = 'serenityPWA2'
const filesToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/images/moon.svg',
]

self.addEventListener('install', e => {
  console.log('[ServiceWorker] install')
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell')
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener('activate', e => {
  console.log('[ServiceWorker] activate')
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', e => {
  console.log('[ServiceWorker] fetch', e.request.url)
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)))
})
