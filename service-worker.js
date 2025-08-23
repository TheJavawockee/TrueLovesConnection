const CACHE_VERSION = 'v1';
const CACHE_NAME = `love-notes-${CACHE_VERSION}`;

const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './icon.png',
  './manifest.json',
  './MyPatrycja.wav'
];

// Install event
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

// Fetch event - cache first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse =>
      cachedResponse || fetch(event.request)
    )
  );
});
