
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

async function getSightingForm(sighting,chats = [], imageString){
    let formData = new FormData();
    if (chats.length > 0){
        // Convert to String json
        let chats_json = JSON.stringify(chats);
        formData.append('chats', chats_json);
        delete sighting.chats;
    }
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

async function uploadSighting(sighting,chats,imageString){
    try {
        let formData = await getSightingForm(sighting,chats,imageString);
        let res = await
            fetch('/upload/sighting', {
            method: 'POST',
            body: formData
        }).then((response) => {
            return response.json();
        });
        return res['id'];
    }
    catch (err){
        console.log(err);
        return null;
    }
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