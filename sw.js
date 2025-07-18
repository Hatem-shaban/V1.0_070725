// Service Worker for Production Caching
const CACHE_NAME = 'startupstack-ai-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/app.js',
    '/config.js',
    '/monitoring.js',
    '/privacy.html',
    '/terms.html',
    '/success.html',
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Caching app shell
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve cached resources when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        // Deleting old cache
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
