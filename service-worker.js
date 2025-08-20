const cacheName = 'love-notes-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icon.png',
  '/manifest.json',
  '/Romantic.mp3'
];

// Install event - cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event - remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of pages
});

// Fetch event - respond from cache first, fallback to network
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Cache Firestore requests too
  if (requestUrl.origin === location.origin || requestUrl.href.includes('firestore.googleapis.com')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(networkResponse => {
          return caches.open(cacheName).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          // optional: return fallback page if network and cache fail
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
    );
  } else {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  }
});
