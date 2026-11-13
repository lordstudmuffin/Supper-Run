// Offline support: serve the saved copy first, refresh it in the background.
const CACHE = 'supper-run-850490251';
const FILES = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  const own = u.origin === location.origin, font = u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  // Only the app's own files and its fonts are cached. Database calls always go straight to the network.
  if (e.request.method !== 'GET' || !(own || font)) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const fresh = fetch(e.request).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone()); return r; });
    if (own) { try { return await fresh; } catch (err) { return (await c.match(e.request)) || (await c.match('index.html')) || Response.error(); } }
    const hit = await c.match(e.request); fresh.catch(() => { });
    return hit || fresh;
  }));
});
