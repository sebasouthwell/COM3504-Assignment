// Function to handle adding a new sighting
const addNewSightingToSync = (syncSightingIDB) => {
    // Retrieve sighting text and add it to the IndexedDB
    console.log("addNewSightingToSync");

    navigator.serviceWorker.ready.then((sw) => {
        console.log("addNewSightingToSync sw ready");
        sw.sync.register("sync-sighting")
    }).then(() => {
        console.log("Sync registered");
    }).catch((err) => {
        console.log("Sync registration failed: " + JSON.stringify(err))
    })

}

// Function to add new sightings to IndexedDB and return a promise
const addNewSightingsToIDB = (sightingIDB, sightings) => {
    return new Promise((resolve, reject) => {
        const transaction = sightingIDB.transaction(["sightings"], "readwrite");
        const sightingStore = transaction.objectStore("sightings");

        const addPromises = sightings.map(sighting => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = sightingStore.add(sighting);
                addRequest.addEventListener("success", () => {
                    console.log("Added " + "#" + addRequest.result + ": " + sighting.text);
                    const getRequest = sightingStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        console.log("Found " + JSON.stringify(getRequest.result));
                        // Assume insertSightingInList is defined elsewhere
                        // insertSightingInList(getRequest.result);
                        resolveAdd(); // Resolve the add promise
                    });
                    getRequest.addEventListener("error", (event) => {
                        rejectAdd(event.target.error); // Reject the add promise if there's an error
                    });
                });
                addRequest.addEventListener("error", (event) => {
                    rejectAdd(event.target.error); // Reject the add promise if there's an error
                });
            });
        });

        // Resolve the main promise when all add operations are completed
        Promise.all(addPromises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
};


// Function to remove all sightings from idb
const deleteAllExistingSightingsFromIDB = (sightingIDB) => {
    const transaction = sightingIDB.transaction(["sightings"], "readwrite");
    const sightingStore = transaction.objectStore("sightings");
    const clearRequest = sightingStore.clear();

    return new Promise((resolve, reject) => {
        clearRequest.addEventListener("success", () => {
            resolve();
        });

        clearRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
};




// Function to get the sighting list from the IndexedDB
const getAllSightings = (sightingIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = sightingIDB.transaction(["sightings"]);
        const sightingStore = transaction.objectStore("sightings");
        const getAllRequest = sightingStore.getAll();

        // Handle success event
        getAllRequest.addEventListener("success", (event) => {
            resolve(event.target.result); // Use event.target.result to get the result
        });

        // Handle error event
        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}


// Function to get the sighting list from the IndexedDB
const getAllSyncSightings = (syncSightingIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = syncSightingIDB.transaction(["sync-sightings"]);
        const sightingStore = transaction.objectStore("sync-sightings");
        const getAllRequest = sightingStore.getAll();

        getAllRequest.addEventListener("success", () => {
            resolve(getAllRequest.result);
        });

        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

// Function to delete a syn
const deleteSyncSightingFromIDB = (syncSightingIDB, id) => {
    const transaction = syncSightingIDB.transaction(["sync-sightings"], "readwrite")
    const sightingStore = transaction.objectStore("sync-sightings")
    const deleteRequest = sightingStore.delete(id)
    deleteRequest.addEventListener("success", () => {
        console.log("Deleted " + id)
    })
}

function openSightingsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("sightings", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('sightings', {keyPath: '_id'});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

function openSyncSightingsIDB() {
    console.log("openSyncSightingsIDB")
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("sync-sightings", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('sync-sightings', {keyPath: 'id', autoIncrement: true});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}
