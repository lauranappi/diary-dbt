const CACHE = 'diary-dbt-202609081437';

// Solo asset esterni che non cambiano mai
const STATIC = [
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
  // I file versionati (?v=...) non passano mai dalla cache: ignora le versioni
  // vecchie ed evita che un service worker obsoleto serva stili superati.
  if (e.request.url.includes('?v=')) return;

  const url = new URL(e.request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isCDN = STATIC.includes(e.request.url);

  // Supabase e altre chiamate cross-origin: lascia fare al browser
  if (e.request.method !== 'GET' || (!sameOrigin && !isCDN)) return;

  // CDN: cache-first (non cambia mai)
  if (isCDN) {
    e.respondWith(
      caches.match(e.request).then(c => c || fetch(e.request).then(res => {
        if (res.status === 200) caches.open(CACHE).then(ch => ch.put(e.request, res.clone()));
        return res;
      }))
    );
    return;
  }

  // TUTTO il resto same-origin (index.html, css/, js/, icone):
  // NETWORK-FIRST — così ogni reload prende il codice aggiornato da GitHub Pages.
  // La cache serve solo da fallback offline.
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
