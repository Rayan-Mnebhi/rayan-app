// Service Worker para Rayan PWA
const CACHE_NAME = 'rayan-v1';
const urlsToCache = [
  './rayan-fixed.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devolver cache
        if (response) {
          return response;
        }
        // Si no, hacer fetch normal
        return fetch(event.request);
      })
  );
});

// Manejo de notificaciones push
self.addEventListener('push', event => {
  console.log('[Service Worker] Push recibido');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de Rayan',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'rayan-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Rayan', options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notificación clickeada');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('./rayan-fixed.html')
  );
});
