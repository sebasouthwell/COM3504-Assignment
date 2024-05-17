// Register service worker to control making site work offline
// window.onload = function () {
//     console.log("main Module onload");
//     if ('serviceWorker' in navigator) {
//         console.log("main Module if service");
//         navigator.serviceWorker.register('/sw.js', {scope: '/'})
//             .then(function (reg) {
//                 console.log('Service Worker Registered!', reg);
//                 setupNotifications();
//             })
//             .catch(function (err) {
//                 console.log('Service Worker registration failed: ', err);
//             });
//     }
// }
// Using alternate method to register SW as previous stopped working
window.addEventListener('load', () =>{
    console.log("main Module load");
    if ('serviceWorker' in navigator) {
        console.log("main Module if service");
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(function (reg) {
                console.log('Service Worker Registered!', reg);
                setupNotifications();
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
            });
    }
});