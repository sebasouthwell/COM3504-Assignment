
// Register service worker to control making site work offline
window.onload = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(function (reg) {
                console.log('Service Worker Registered!', reg);
                setupNotifications();
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
            });
    }
}

async function base64toBlob(b64){
    try{
        let res = await fetch(b64);
        let blob = await res.blob();
        return blob;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

async function getSightingForm(sighting, imageString){
    let formData = new FormData();
    let sighting_keys = sighting.key
    for (const key in sighting){
        formData.append(key, sighting[key])
    }
    if (imageString){
        let photoBlob = await base64toBlob(imageString);
        if (photoBlob){
            formData.append('photo', photoBlob, "image.png");
        }
    }
    return formData;
}

async function uploadSighting(sighting,imageString){
    try {
        let formData = await getSightingForm(sighting,imageString);
        let res = await fetch('/upload/sighting', {
            method: 'POST',
            body: formData
        }).then((response) => {
            return response.json();
        }).catch((response) => {
            return null;
        })
        return res === null ? null : res['id'];
    }
    catch (err){
        console.log(err);
        return null;
    }
}

async function uploadSightingsFromIndex(){
    handler.getAll(sightings,async (sighting_list) => {
        for (let i = 0; i < sighting_list.length; i++) {
            uploadSighting(sighting_list[i], null).then((id) => {
                let sightingID = sighting_list[i]._id;
                console.log(sightingID);
                if (id){
                    handler.delete(sightings, sightingID, () => {
                    });
                }
            })
        }
    })
}

async function uploadChats(){
    handler.getAllKeys(messages, (keys) => {
        for (let key of keys){
            handler.request(messages,key,async (chats) => {
                console.log("Old Chats");
                console.log(chats);
                let keys = Object.keys(chats);
                for (let j = 0; j < keys.length; j++){
                    let key = keys[j];
                    console.log(key)
                    try{
                        let chat_message = JSON.stringify(chats[key]);
                        let res = await fetch('/upload/chat', {
                            method: 'POST',
                            body: chat_message,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((response) => {
                            return response.json();
                        }).catch((response) => {
                            return null;
                        })
                        console.log(res);
                        if (res !== null && res['state'] === 'success'){
                            delete chats[key];
                            console.log(chats);
                        }
                    }
                    catch (err){
                        console.log(err);
                    }
                }
                console.log("New Chats");
                if (Object.keys(chats).length === 0){
                    handler.delete(messages,key,() => {});
                }
                else{
                    // This removes all uploaded chats from localDB
                    handler.update(messages, key, chats, () => {
                    });
                }
            });
        }
    })
}
async function offlineToOnline(){
    await uploadSightingsFromIndex();
    await uploadChats();
}

function setupNotifications() {
    // Check if the browser supports the Notification API
    if ("Notification" in window) {
        // Check if the user has granted permission to receive notifications
        if (Notification.permission === "granted"){

        }
        // Notifications are allowed, you can proceed to create notifications
        // Or do whatever you need to do with notifications
    } else if (Notification.permission !== "denied") {
        // If the user hasn't been asked yet or has previously denied permission,
        // you can request permission from the user
        Notification.requestPermission().then(function (permission) {
            // If the user grants permission, you can proceed to create notifications
            if (permission === "granted") {
                notify_able = true;
                navigator.serviceWorker.ready
                    .then(function (swreg) {
                        swreg.showNotification("Planttrest App",
                            {body: "Notifications are enabled!"})
                            .then(r =>
                                console.log(r)
                            );
                    });
            }
        });
    }
}
function makeNotification(title,body) {
    body['timestamp'] = new Date();
    body['lang'] = 'en';

    if (Notification.permission === "granted"){
        navigator.serviceWorker.ready
            .then(function (swreg) {
                console.log('Showing notification');
                swreg.showNotification(title,
                    body)
                    .then(r =>
                        console.log(r)
                    );
            });
    }
}