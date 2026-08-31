// sw.js - Service Worker
const CACHE_NAME = 'kuwait-pies-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './track.html',
  './admin.html',
  './css/styles.css',
  './js/kuwait-areas.js',
  './js/products.js',
  './js/cart.js',
  './js/checkout.js',
  './js/app.js',
  './js/track.js',
  './js/admin.js',
  './assets/logo.svg',
  './assets/knet-logo.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
