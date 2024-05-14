const insertSightingInList = (sighting) => {
    if (sighting.text) {
        const copy = document.getElementById("sighting_template").cloneNode()
        copy.removeAttribute("id") // otherwise this will be hidden as well
        copy.innerText = sighting.text
        copy.setAttribute("data-sighting-id", sighting.id)

        // Insert sorted on string text order - ignoring case
        const sightinglist = document.getElementById("sighting_list")
        const children = sightinglist.querySelectorAll("li[data-sighting-id]")
        let inserted = false
        for (let i = 0; (i < children.length) && !inserted; i++) {
            const child = children[i]
            const copy_text = copy.innerText.toUpperCase()
            const child_text = child.innerText.toUpperCase()
            if (copy_text < child_text) {
                sightinglist.insertBefore(copy, child)
                inserted = true
            }
        }
        if (!inserted) { // Append child
            sightinglist.appendChild(copy)
        }

    }
}

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