// SERVICE WORKER PARA RAYAN APP PWA
console.log('[Service Worker] Iniciando...');

// Nombre de cache
const CACHE_NAME = 'rayan-app-v1';

// Instalación del service worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalado correctamente');
    // Forzar activación inmediata
    self.skipWaiting();
});

// Activación del service worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activado correctamente');
    // Tomar control de todas las páginas inmediatamente
    event.waitUntil(self.clients.claim());
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
    // Estrategia: Network First (primero red, luego cache)
    // Esto asegura que siempre tengas la versión más actualizada
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                // Si falla la red, no hacemos nada especial por ahora
                // Esto permite que la app funcione online sin problemas
                return new Response('Offline', { status: 503 });
            })
    );
});

console.log('[Service Worker] Configurado y listo');
