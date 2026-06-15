const CACHE = 'housemaster-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).catch(function(){
        // Offline fallback — return cached index.html for navigation
        if(e.request.mode === 'navigate'){
          return caches.match('/index.html');
        }
      });
    })
  );
});
