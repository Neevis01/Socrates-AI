const CACHE_NAME = 'socrates-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json'
];

// Installation: Speichert die wichtigsten Dateien im Offline-Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch: Fängt Netzwerkanfragen ab (Offline-Unterstützung)
self.addEventListener('fetch', event => {
  // Wenn es eine API-Anfrage (Gemini/DB) ist, IMMER das Netzwerk nutzen
  if (event.request.url.includes('/api/')) {
    return; 
  }
  
  // Bei normalen Dateien (CSS, HTML) zuerst im Cache schauen
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});