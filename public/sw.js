/* Minimal service worker — enables installability + a basic offline cache.
   Strategy: network-first for navigations (so deploys stay fresh), and
   stale-while-revalidate for same-origin static assets.

   CACHE is stamped with a unique build id at build time (see
   scripts/stamp-sw.mjs). A fresh id on every deploy changes this file's bytes,
   so the browser installs the new SW; the `activate` handler then purges every
   cache whose name isn't the current build, so stale assets never survive a
   deploy. `__BUILD_ID__` is the un-stamped dev fallback. */
const CACHE = '__BUILD_ID__';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Navigations: network-first, fall back to cache (offline shell).
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((m) => m || caches.match('./'))),
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
