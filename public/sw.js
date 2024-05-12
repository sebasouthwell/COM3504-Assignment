import "/javascripts/indexDBHandler.js"

const CACHE_NAME = 'Plantrest - v1'


console.log('Service Worker Called...');
self.addEventListener('install', (event) => {
    console.log('[Service Worker] : Installed');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache_obj) {
            console.log('[ServiceWorker] Caching app shell');
            fetch("http://localhost:3000/image_paths", {
                method: 'get'
            }).then(r => {
git
                }
            )
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
        })
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-todo') {
        console.log('Service Worker: Syncing new Todos');
        openSyncTodosIDB().then((syncPostDB) => {
            getAllSyncTodos(syncPostDB).then((syncTodos) => {
                for (const syncTodo of syncTodos) {
                    console.log('Service Worker: Syncing new Todo: ', syncTodo);
                    console.log(syncTodo.text)
                    // Create a FormData object
                    const formData = new URLSearchParams();

                    // Iterate over the properties of the JSON object and append them to FormData
                    formData.append("text", syncTodo.text);

                    // Fetch with FormData instead of JSON
                    fetch('http://localhost:3000/c', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then(() => {
                        console.log('Service Worker: Syncing new Todo: ', syncTodo, ' done');
                        deleteSyncTodoFromIDB(syncPostDB,syncTodo.id);
                        // Send a notification
                        self.registration.showNotification('Todo Synced', {
                            body: 'Todo synced successfully!',
                        });
                    }).catch((err) => {
                        console.error('Service Worker: Syncing new Todo: ', syncTodo, ' failed');
                    });
                }
            });
        });
    }
});