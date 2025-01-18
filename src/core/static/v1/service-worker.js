"use strict";

const VERSION = "v1.0";
const CACHE_NAME = `abuein-${VERSION}`;

const importmap = {
    "imports": {
      "auth": "/v1/assets/js/points/auth.mjs",
      "homeland": "/v1/assets/js/points/returnToHomeland.mjs",
      "firebaseX": "/v1/assets/js/integration/firebase.mjs",
      "stripe": "/v1/assets/js/integration/stripe.mjs",
      "sumup": "/v1/assets/js/integration/sumup.mjs",
      "tomtom": "/v1/assets/js/integration/tomtom.mjs",
      "classes": "/v1/assets/js/context/classes.mjs",
      "links": "/v1/assets/js/context/links.mjs",
      "experience": "/v1/assets/js/mods/experience.mjs",
      "games": "/v1/assets/js/mods/games.mjs",
      "importer": "/v1/assets/js/mods/importer.mjs",
      "interface": "/v1/assets/js/mods/interface.mjs",
      "media": "/v1/assets/js/mods/media.mjs",
      "service": "/v1/assets/js/mods/service.mjs",
      "utils": "/v1/assets/js/mods/utils.mjs",
      "web": "/v1/assets/js/mods/web.mjs",
    }
  };

/** Resources to pre-cache. */
const INITIAL_CACHED_RESOURCES = [];
Object.entries(importmap.imports).forEach(url => INITIAL_CACHED_RESOURCES.push(url));

self
    .importScripts
    //"https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js",
    //"https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css",
    //"https://js.stripe.com/v3/",
    ();

/** On install, cache essential resources. */
self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(INITIAL_CACHED_RESOURCES))
    );
});

/** On activate, clean up old caches. */
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys.map((key) => key !== CACHE_NAME && caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

/** This event occurs when incoming messages are received. */
self.addEventListener("message", (event) => {
    // event is an ExtendableMessageEvent object
    console.log(`The client sent me a message: ${event.data}`);
    event.source.postMessage("Hi client.");
});

/** Fetch handler using Service Worker with network-first strategy for external resources. */
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    // Cache http and https only, skip unsupported chrome-extension:// and file://...
    if (
        !(url.protocol.startsWith("http:") || url.protocol.startsWith("https:"))
    )
        return;

    // Network-first for external resources
    if (url.origin !== location.origin && event.request.method === "GET") {
        event.respondWith(
            fetch(event.request)
                .then(async (networkResponse) => {
                    // Clone the response before consuming it
                    const responseClone = networkResponse.clone();
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(event.request, responseClone);
                    return networkResponse;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for internal resources
    if (event.request.method === "GET") {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    // console.log("Found response in cache:", cachedResponse);
                    return cachedResponse;
                } else {
                    console.log("Falling back to network.");
                    return fetch(event.request).then((fetchResponse) => {
                        // Clone the response before consuming it
                        const responseClone = fetchResponse.clone();
                        const cachePromise = caches
                            .open(CACHE_NAME)
                            .then((cache) =>
                                cache.put(event.request, responseClone)
                            );
                        event.waitUntil(cachePromise);
                        return fetchResponse;
                    });
                }
            })
        );
    }

    // when even the response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened.", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
    });
});

/** The sync event of the ServiceWorkerGlobalScope interface is fired when the page (or worker) that registered the event with the SyncManager is running and as soon as network connectivity is available. */
self.addEventListener("sync", (event) => {
    if (event.tag === "sync-messages") {
        event.waitUntil(sendOutboxMessages());
    }
});

self.addEventListener("periodicsync", (event) => {
    if (event.tag === "content-sync") {
        event.waitUntil(syncContent());
    }
});

/** Register event listener for the 'push' event. */
self.addEventListener(
    "push",
    (event) => {
        const message = event.data.json();

        switch (message.type) {
            case "init":
                doInit();
                break;
            case "shutdown":
                doShutdown();
                break;
        }

        // Retrieve the textual payload from event.data (a PushMessageData object).
        // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
        // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
        const payload = event.data ? event.data.text() : "no payload";

        // Keep the service worker alive until the notification is created.
        event.waitUntil(
            // Show a notification with title 'ServiceWorker Cookbook' and use the payload
            // as the body.
            self.registration.showNotification("AbuEin Web Portal", {
                body: payload,
            })
        );
    },
    false
);

if (!("BackgroundFetchManager" in self)) {
    // Provide fallback downloading.
  }
  