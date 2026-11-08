// The phone version: network first, so updates show when online; the cached copy keeps the map opening offline.
// The shell is cached at install; pictures and crests are kept as they are first seen.
const CACHE = 'sengoku';
const SHELL = ['./', 'index.html', 'app.js', 'model.js', 'manifest.webmanifest', 'icon.png', 'icon-180.png', 'icon-512.png',
  'images/terrain.jpg', 'fonts/mincho-400.woff2', 'fonts/mincho-700.woff2', 'fonts/gothic-400.woff2', 'fonts/gothic-500.woff2',
  ...['provinces', 'history', 'images', 'crests', 'places', 'modern', 'georef', 'relief', 'ryukyu', 'landmarks'].map(f => `data/${f}.js`)];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true })));
});
