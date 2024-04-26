navigator.serviceWorker.register('/sw.js').then(
    (registration) => {
        console.log("SW Registered!: ", registration.scope);
    },
    (registrationError) => {
        console.log("SW registration failed: ", registrationError);
    }
);