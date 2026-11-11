/* DayBloom service worker: static app-shell cache only. Never cache private data or API responses. */
const CACHE_PREFIX = "daybloom-static-";
const CACHE_NAME = CACHE_PREFIX + "v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  // Do not skipWaiting automatically: let the user choose when to update.
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    // Remove only older caches owned by this DayBloom worker.
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Only same-origin static app files are eligible. Never intercept API/data endpoints.
  if (url.origin !== self.location.origin) return;
  const isNavigation = request.mode === "navigate";
  const isStaticAsset = /\.(?:html|css|js|png|svg|webp|woff2?)$/i.test(url.pathname) || url.pathname.endsWith("manifest.webmanifest");
  if (!isNavigation && !isStaticAsset) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (isNavigation) {
      try {
        const fresh = await fetch(request);
        if (fresh.ok) cache.put("./index.html", fresh.clone());
        return fresh;
      } catch (_) {
        return (await cache.match("./index.html")) || new Response("DayBloom is offline and the saved app page is not available yet.", {status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
      }
    }
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const fresh = await fetch(request);
      if (fresh.ok && url.origin === self.location.origin) cache.put(request, fresh.clone());
      return fresh;
    } catch (_) {
      return new Response("This file is not available offline.", {status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
    }
  })());
});
