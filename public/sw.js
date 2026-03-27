const CACHE_VERSION = 'notionnext-v1'
const STATIC_CACHE = CACHE_VERSION + '-static'
const RUNTIME_CACHE = CACHE_VERSION + '-runtime'
const MAX_RUNTIME_ENTRIES = 60

const PRECACHE_URLS = [
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
]

const STATIC_EXT = /\.(js|css|woff2?|ttf|otf|eot|png|jpg|jpeg|gif|webp|avif|svg|ico)(\?.*)?$/i

const CACHEABLE_CDN = [
  'cdn.jsdmirror.com',
  'npm.elemecdn.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'lf-cdn.coze.cn'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache =>
        Promise.allSettled(
          PRECACHE_URLS.map(url => cache.add(url).catch(() => {}))
        )
      )
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith('notionnext-') && k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

function trimCache(cacheName, max) {
  caches.open(cacheName).then(cache =>
    cache.keys().then(keys => {
      if (keys.length > max) {
        cache.delete(keys[0]).then(() => trimCache(cacheName, max))
      }
    })
  )
}

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  const isSameOrigin = url.origin === self.location.origin
  const isCDN = CACHEABLE_CDN.some(h => url.hostname === h)

  if (!isSameOrigin && !isCDN) return
  if (isSameOrigin && (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth'))) return

  // Next.js build assets — immutable, cache forever
  if (isSameOrigin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(resp => {
          if (resp.ok) {
            const clone = resp.clone()
            event.waitUntil(caches.open(STATIC_CACHE).then(c => c.put(request, clone)))
          }
          return resp
        })
      })
    )
    return
  }

  // Static assets & CDN resources — cache-first
  if (STATIC_EXT.test(url.pathname) || isCDN) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(resp => {
          if (resp.ok && resp.type !== 'opaque') {
            const clone = resp.clone()
            event.waitUntil(caches.open(STATIC_CACHE).then(c => c.put(request, clone)))
          }
          return resp
        })
      }).catch(() => caches.match(request))
    )
    return
  }

  // Pages — network-first, cache fallback
  event.respondWith(
    fetch(request)
      .then(resp => {
        if (resp.ok) {
          const clone = resp.clone()
          event.waitUntil(
            caches.open(RUNTIME_CACHE).then(c => {
              c.put(request, clone)
              trimCache(RUNTIME_CACHE, MAX_RUNTIME_ENTRIES)
            })
          )
        }
        return resp
      })
      .catch(() =>
        caches.match(request).then(cached => {
          if (cached) return cached
          if (request.mode === 'navigate') return caches.match('/')
          return new Response('Offline', { status: 503 })
        })
      )
  )
})
