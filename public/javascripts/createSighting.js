window.addEventListener('load', function () {
    document.getElementById('dateTime').value = new Date().toISOString()
});

function createSighting() {
    // Summarises the form via getting innerHTML of the form
    console.log("createSighting");
    let form = document.getElementById('sightingForm');

    openSyncSightingsIDB().then((db) => {
        addNewSightingToSync(db);
    });
    navigator.serviceWorker.ready
        .then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.showNotification("Sighting App",
                {body: "Sighting added! - "})
                .then(r =>
                    console.log(r)
                );
        });

}
function showColour(){
    if(document.getElementById("colourShow").classList.contains("hidden")){
        document.getElementById("colourShow").classList.remove("hidden");
    }else{
        document.getElementById("colourShow").classList.add("hidden");
    }
}
// Get elements
const colorInput = document.getElementById('colorInput');
const colorPreview = document.getElementById('colorPreview');

// Set initial color preview
colorPreview.style.backgroundColor = colorInput.value;

// Update color preview when input changes
colorInput.addEventListener('input', function() {
    colorPreview.style.backgroundColor = colorInput.value;
});