const CACHE_VERSION = 'v1';
const CACHE_NAME = `love-notes-${CACHE_VERSION}`;

const assetsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icon.png',
  '/manifest.json',
  '/MyPatrycja.wav',
  '/offline.html'
];

// Install event - cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assetsToCache))
  );
  self.skipWaiting();
});

// Activate event - remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event - respond from cache first, fallback to network
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Cache Firestore requests too
  if (requestUrl.origin === location.origin || requestUrl.href.includes('firestore.googleapis.com')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then(networkResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            // fallback to offline page for documents
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => 
        cachedResponse || fetch(event.request).catch(() => caches.match('/offline.html'))
      )
    );
  }
});
