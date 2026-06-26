const CACHE = 'diary-dbt-v42';
const STATIC = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Only intercept GET requests for our own origin (plus the precached CDN
  // assets). Everything else (Supabase calls, POST/PUT/PATCH, other
  // cross-origin requests) is left untouched so the browser handles it
  // normally instead of routing it through this SW logic.
  const isSameOrigin = url.origin === self.location.origin;
  const isPrecachedCDN = STATIC.includes(e.request.url);
  if (e.request.method !== 'GET' || (!isSameOrigin && !isPrecachedCDN)) {
    return;
  }

  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request.clone())
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(res => {
          if (res.status === 200)
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        })
        .catch(err => {
          if (cached) return cached;
          throw err;
        });
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
