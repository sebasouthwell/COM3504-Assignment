
// Register service worker to sync sightings
window.onload = function () {
    navigator.serviceWorker.ready.then((sw) => {
        console.log("addNewSightingToSync sw ready");
        sw.sync.register("sync-sighting")
    }).then(() => {
        console.log("Sync registered");
    }).catch((err) => {
        console.log("Sync registration failed: " + JSON.stringify(err))
    })
}