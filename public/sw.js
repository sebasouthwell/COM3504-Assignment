self.importScripts('/javascripts/indexDBHandler.js',"/javascripts/form_handler.js");
const CACHE_NAME = 'Plantrest - v1'
const DEFAULT_CACHING_FILES  = [
    'https://hips.hearstapps.com/hmg-prod/images/high-angle-view-of-variety-of-succulent-plants-royalty-free-image-1584462052.jpg',
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
    '/javascripts/localSightView.js',
    '/javascripts/indexDBHandler.js',
    '/javascripts/createSighting.js',
    '/javascripts/syncSightings.js',
    "/javascripts/form_handler.js",
    '/javascripts/mainModule.js',
    '/javascripts/searchPlants.js',
    '/javascripts/sighting.js',
    "/javascripts/login.js",
    '/sight',
    '/sight_view',
    '/login',
    '/',
    '/manifest.json',
    '/javascripts/idb-utility.js',
    '/static/images/logo.png',
    '/static/images/Fruits.png',
    '/static/images/Flower.png',
    '/static/images/Seeds.png',
    '/static/images/favicon.ico',
    '/static/images/image_icon.png',
    'https://cdn.socket.io/4.5.4/socket.io.min.js'
];

let notRefreshable = ['js','css', 'bootstrap','manifest','static'];

let swDebug= false;
function debugLog(message) {
    if (swDebug) {
        console.log(message);
    }
}
console.log('Service Worker Called...');
self.addEventListener('install', (event) => {
    debugLog('[Service Worker] : Installed');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache_obj) {
            debugLog('[ServiceWorker] Caching app shell');
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
            debugLog("Failed to cache");
        })
    );
});

self.addEventListener( 'activate', (event) => {
    debugLog("[Service Worker] : Activated ");
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
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    debugLog('[Service Worker] : Fetching]');
    const request = event.request;
    let url = request;
    if (request.url.includes('sight_view?id')) {
        const parsedURL = new URL(request.url);
        url = parsedURL.origin + '/sight_view';
    }
    if (request.method !== 'GET' || request.url.includes('cache_links') || request.url.includes('user_sightings') || request.url.includes('sight_messages') || request.url.includes('upload')){
        if (!request.url.includes('socket.io')){
            console.log(request);
        }
        return fetch(event.request).then((response) => {
            console.log(`Success : ${response}`);
            return response;
        }).catch((error) => {
            console.log(`Failed : ${error}`);
            return error;
        })
    }
    else{
        event.respondWith(
            caches.match(url).then(function (response) {
                if (response) {
                    let modifiable = true;
                    for (let i of notRefreshable){
                        if (request.url.includes(i)){
                            modifiable = false;
                            break;
                        }
                    }
                    if (modifiable){
                        // Check if file has changed since cache
                        fetch(request).then((request_output) => {
                            const request_clone = request_output.clone();
                            if (request_output.ok) {
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(request, request_clone);
                                });
                                response = request_clone;
                            }
                        }).catch((err) => {
                            debugLog("Fetch error: " + err);
                        });
                    }
                    return response;
                }
                else{
                    return fetch(request).then((request_output) =>{
                        if (request_output.ok) {
                            const request_clone = request_output.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(url, request_clone);
                            });
                        }
                        return request_output;
                    }).catch((err) => {
                        debugLog("Fetch error: " + err);
                    });
                }
            })
        );
    }
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-sighting') {
        event.waitUntil(offlineToOnline()
            .then(() => {
                console.log('Synced to Server')
            })
            .catch(() => {
                console.log("Error syncing to server");
            })
        );
    }
});
/*
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
    if (event.tag === 'sync-message') {
        console.log('Service Worker: Syncing new Message');
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
*/