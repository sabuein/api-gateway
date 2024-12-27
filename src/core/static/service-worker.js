const VERSION = "v1.0";
const CACHE_NAME = `abuein-${VERSION}`;

// Resources to pre-cache
const INITIAL_CACHED_RESOURCES = [
  "/",
  "assets/css/default.css",
  "assets/js/models/classes.js",
  "assets/js/models/elements.js",
  "assets/js/modules/apiReturnToHomeland.js",
  "assets/js/modules/apiService.js",
  "assets/js/modules/authService.js",
  "assets/js/modules/gameService.js",
  "assets/js/modules/importer.js",
  "assets/js/modules/interface.js",
  "assets/js/modules/maps.js",
  "assets/js/modules/utils.js",
  "assets/js/app.js",
];

// On install, cache essential resources
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(INITIAL_CACHED_RESOURCES))
  );
});

// On activate, clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Fetch handler with network-first strategy for external resources
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Network-first for external resources
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Clone the response before consuming it
          const responseClone = networkResponse.clone();
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for internal resources
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(fetchResponse => {
        // Clone the response before consuming it
        const responseClone = fetchResponse.clone();
        const cachePromise = caches.open(CACHE_NAME).then(cache =>
          cache.put(event.request, responseClone)
        );
        event.waitUntil(cachePromise);
        return fetchResponse;
      });
    })
  );
});
