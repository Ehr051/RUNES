// ── RUNES Service Worker v3 ────────────────────────────────
const CACHE_NAME = 'runes-v3';
const PRECACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.min.js',
  '/manifest.json'
];

// Install: precache core assets only
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for core, network-first for audio
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  
  const url = new URL(e.request.url);
  
  // Skip Firestore/Firebase API calls
  if (url.hostname.includes('firestore.googleapis.com') || 
      url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') && url.pathname.includes('google.firestore')) {
    return;
  }
  
  // Audio: network-first (stream, don't block)
  if (url.pathname.includes('/audio/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  
  // HTML: network-first (prevent stale cache during redirect/auth)
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html') || 
      url.pathname === '/' || e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  
  // Images: cache-first
  if (url.pathname.includes('/img/')) {
    e.respondWith(
      caches.match(e.request).then(cached => 
        cached || fetch(e.request).then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return resp;
        })
      )
    );
    return;
  }
  
  // Core: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
