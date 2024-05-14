importScripts('/javascripts/idb-utility.js');

const CACHE_NAME = 'Plantrest - v1'
const DEFAULT_CACHING_FILES  = [
    "/jquery/dist/jquery.js",
    '/bootstrap/dist/css/bootstrap.min.css',
    '/stylesheets/style.css',
    '/bootstrap-icons/font/bootstrap-icons.css',
    "/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css",
    "/bootstrap-datetime-picker/js/bootstrap-datetimepicker.js",
    '/bootstrap/dist/js/bootstrap.js',
    '/bootstrap/dist/js/bootstrap.bundle.js',
    '/bootstrap-icons/font/fonts/bootstrap-icons.woff?dd67030699838ea613ee6dbda90effa6',
    '/bootstrap-icons/font/fonts/bootstrap-icons.woff2?dd67030699838ea613ee6dbda90effa6',
    '/bootstrap-icons/bootstrap-icons.svg',
    '/javascripts/main.js',
    '/javascripts/name_and_sockets.js',
    '/javascripts/locationManager.js',
    '/javascripts/indexDBHandler.js',
    '/javascripts/createSighting.js',
    '/javascripts/mainModule.js',
    '/javascripts/searchPlants.js',
    '/javascripts/sighting.js',
    "/javascripts/login.js",
    '/sight',
    '/',
    '/manifest.json',
    '/javascripts/idb-utility.js',
    '/static/images/logo.png',
    '/static/images/Fruits.png',
    '/static/images/Flower.png',
    '/static/images/Seeds.png',
    '/static/images/favicon.ico',
    '/static/images/image_icon.png',
    '/sight_view',
    'https://cdn.socket.io/4.5.4/socket.io.min.js'
];

console.log('Service Worker Called...');
self.addEventListener('install', (event) => {
    console.log('[Service Worker] : Installed');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache_obj) {
            console.log('[ServiceWorker] Caching app shell');
            fetch("http://localhost:3000/cache_links", {
                method: 'get'
            }).then(r => {
                r.json().then(rjson => {
                    cache_obj.addAll(rjson);
                    cache_obj.addAll(DEFAULT_CACHING_FILES);
                }).catch(() =>{
                    cache_obj.addAll(DEFAULT_CACHING_FILES);
                })
                }
            ).catch(() => {
                cache_obj.addAll(DEFAULT_CACHING_FILES);
            })
        }).catch(() =>{
            console.log("Failed to cache");
            return cache_obj.addAll(DEFAULT_CACHING_FILES);
        })
    );
});

self.addEventListener( 'activate', (event) => {
    console.log("[Service Worker] : Activated ");
    event.waitUntil(
        (async() => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if (cache !== CACHE_NAME){
                    console.log('Service Worker: Removing old cache: ' + cache)
                    return await caches.delete(cache);
                }
            })
        })
    )
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] : Fetching]');
    const request = event.request;
    console.log("Url", request.url);
    event.respondWith(
        caches.match(request).then(function(response){
            return response || fetch(request);
        }).catch((error) => {
            console.log('Could not find in cache');
        })
    );
});

self.addEventListener('sync', event => {
    console.log('Service Worker: Syncing Started');
    if (event.tag === 'sync-sighting') {
        console.log('Service Worker: Syncing new Sightings');
        openSyncSightingsIDB().then((syncPostDB) => {
            getAllSyncSightings(syncPostDB).then((syncSightings) => {
                for (const syncSighting of syncSightings) {
                    console.log('Service Worker: Syncing new Sighting: ', syncSighting);
                    console.log(syncSighting.text)
                    // Create a FormData object
                    const formData = new URLSearchParams();

                    // Iterate over the properties of the JSON object and append them to FormData
                    formData.append("text", syncSighting.text);

                    // Fetch with FormData instead of JSON
                    fetch('http://localhost:3000/c', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then(() => {
                        console.log('Service Worker: Syncing new Sighting: ', syncSighting, ' done');
                        deleteSyncSightingFromIDB(syncPostDB,syncSighting.id);
                        // Send a notification
                        self.registration.showNotification('Sighting Synced', {
                            body: 'Sighting synced successfully!',
                        });
                    }).catch((err) => {
                        console.error('Service Worker: Syncing new Sighting: ', syncSighting, ' failed');
                    });
                }
            });
        });
    }
});