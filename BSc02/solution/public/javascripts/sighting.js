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
//Function to make notifications
function makeNotification(title,body) {
    body['timestamp'] = new Date();
    body['lang'] = 'en';
    //Check notification permissions
    if (Notification.permission === "granted"){
        console.log('Notification permitted');
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