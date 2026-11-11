#!/bin/sh
# Builds two things from the same source:
#   supper-run.html  -> the Claude artifact page
#   app/             -> the standalone installable web app (index.html, manifest, service worker, icons)
cd "$(dirname "$0")"
{ cat head.html; echo '<script>'; cat data.js app.js; echo '</script>'; } > supper-run.html
{ echo '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'; cat supper-run.html; echo '</body></html>'; } > preview.html
mkdir -p app
{ cat <<'HEAD'
<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Supper Run">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#E3EEE7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1C192A" media="(prefers-color-scheme: dark)">
<style>:root{padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>
</head><body>
HEAD
echo '<script src="config.js"></script>'
cat supper-run.html
echo "<script>if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});</script>"
echo '</body></html>'; } > app/index.html
cat > app/manifest.webmanifest <<'MAN'
{"name":"Supper Run","short_name":"Supper Run","description":"A co-op cooking roguelike for two.","start_url":"./","scope":"./","display":"standalone","orientation":"portrait","background_color":"#E3EEE7","theme_color":"#CF3F2B",
"icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}
MAN
V=$(cksum supper-run.html | cut -d' ' -f1)
cat > app/sw.js <<SW
// Offline support: serve the saved copy first, refresh it in the background.
const CACHE = 'supper-run-$V';
const FILES = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
SW
wc -c supper-run.html app/index.html
