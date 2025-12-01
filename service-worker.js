// SERVICE WORKER PARA RAYAN APP PWA
console.log('[Service Worker] Iniciando...');

// Nombre de cache
const CACHE_NAME = 'rayan-app-v2';
const BASE_PATH = '/rayan-app/';

// Archivos a cachear
const urlsToCache = [
    BASE_PATH,
    BASE_PATH + 'index.html'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando archivos');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación del service worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Borrando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en cache, devolver cache
                if (response) {
                    console.log('[Service Worker] Sirviendo desde cache:', event.request.url);
                    return response;
                }
                // Si no, buscar en red
                return fetch(event.request)
                    .then((response) => {
                        // Si la respuesta es válida, cachearla
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    });
            })
            .catch(() => {
                // Si falla todo, devolver página cacheada
                return caches.match(BASE_PATH + 'index.html');
            })
    );
});

console.log('[Service Worker] Configurado y listo');
