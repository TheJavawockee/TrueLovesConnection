const cacheName = 'love-notes-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icon.png',
  '/manifest.json',
  '/Romantic.mp3'   // Added audio file for offline caching
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== cacheName) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event - respond with cache or fetch network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Listen for messages from the page to trigger notification
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_LOVE_NOTIFICATION') {
    showLoveNotification();
  }
});

function showLoveNotification() {
  self.registration.showNotification('💖 Good morning from Love Notes!', {
    body: "Here's your daily love note! Have a beautiful day! ❤️",
    icon: 'icon.png',
    vibrate: [100, 50, 100],
    tag: 'daily-love-note',
    renotify: true,
  });
}

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).catch(() => {
        // optionally return a fallback page/image if offline
      });
    })
  );

  // Function to request notification permission
function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('This browser does not support notifications.');
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  });
}

// Function to send message to service worker to show notification
function sendLoveNotification() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SHOW_LOVE_NOTIFICATION' });
  } else {
    alert('Service worker not ready yet.');
  }
}

// Hook the notification permission request to a button or run on page load
document.getElementById('music-toggle').addEventListener('click', () => {
  requestNotificationPermission();
});

// (You can also call requestNotificationPermission() on page load if you want)

// Export sendLoveNotification for your button onclick
window.sendLoveNotification = sendLoveNotification;

});
