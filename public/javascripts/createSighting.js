window.addEventListener('load', function () {
    let date = (new Date()).toISOString();
    date = date.split('T')[0] + " " + date.split('T')[1].split('.')[0];
    $('#dateTime').val(date.substring(0,date.length-3));
    $('#dateTime').datetimepicker();
    $('#dateTime').datetimepicker('setStartDate', '2012-01-01');
    setTimeout(() => {
        $('#userNickName').val(name);
    },110);
    let colorInput = document.getElementById('flowerColour');
    let colorPreview = document.getElementById('colorPreview');
    document.getElementById('userNickName').onchange += (function () {
        $('#userNickName').val($('#nickname')[0].innerHTML)
    })
    // Set initial color preview
    colorPreview.style.backgroundColor = colorInput.value;
    var form = document.getElementById('sightingForm');
    form.addEventListener('submit', function (event) {
        // Check if online or offline
        if (!navigator.onLine){
            event.preventDefault();
            alert("You are offline, please connect to the internet to submit a sighting");
            var imageString = null;
            let file = $('#photoUpload')[0]['files'][0];
            if (file != null){
                var reader = new FileReader();
                reader.onloadend = function () {
                    imageString = reader.result;
                }
                reader.readAsDataURL(file);
                for (i = 0; i < 100; i++){
                    let j = i;
                    // Using a top-level function, which can't be async, and just need a millisecond delay.
                }
            }
            else{
                console.log("No Image")
            }
            function generateQuickGuid() {
                return Math.random().toString(36).substring(2, 25) +
                    Math.random().toString(36).substring(2, 25);
            }
            let guid = generateQuickGuid()

            let sighting = {
                _id: guid, userNickName: $("#userNickName").val(),givenName: $("#givenName").val(),description:$('#description').val(),lat: $('#lat').val(),long: $('#long').val(), plantEstHeight: $('#plantEstHeight').val(), plantEstSpread: $('#plantEstSpread').val(), hasFlowers: $('#hasFlowers').val() === 'on', flowerColour: $('#flowerColour').val(), hasFruit: $('#hasFruit').val()==='on', hasSeeds: $('#hasSeeds').val()==='on', sunExposureLevel: $('#sunExposureLevel').val(), dateTime: $('#dateTime').val(), identificationStatus: $('#identificationStatus').val(), photo: imageString
            }
            if (checkValidity(sighting)){
                handler.update(sightings,guid,sighting,() => {
                  makeNotification('Sighting Saved: Offline Mode', {body: 'You are currently offline, your sighting has been saved to you browser and will be uploaded once you regain server connection'});
                })
                window.location.href = window.origin + '/sight_view?id=' + guid;
            }

            console.log(sighting)
        }
        else{

        }
    });
});

function checkValidity(sighting){
    if (sighting.userNickName === undefined || sighting.userNickName.length === 0){
        return false;
    }
    if (sighting.lat === undefined){
        return false;
    }
    if (sighting.long === undefined){
        return false;
    }
    if (sighting.plantEstHeight === undefined || sighting.plantEstHeight <= 0){
        return false;
    }
    if (sighting.plantEstSpread === undefined || sighting.plantEstSpread <= 0){
        return false;
    }
    if (sighting.sunExposureLevel === undefined || sighting.sunExposureLevel <= 0 || sighting.sunExposureLevel > 100){
        return false;
    }
    if (sighting.identificationStatus === undefined || sighting.identificationStatus.length === 0){
        return false;
    }
    return true;

}


function createSighting() {
    // Summarises the form via getting innerHTML of the form
    let form = document.getElementById('sightingForm');

    openSyncSightingsIDB().then((db) => {
        addNewSightingToSync(db);
    });
    makeNotification('Plantrest', {body: 'Your sighting has been added'});
}
function showColour(){
    if(document.getElementById("colourShow").classList.contains("hidden")){
        document.getElementById("colourShow").classList.remove("hidden");
    }else{
        document.getElementById("colourShow").classList.add("hidden");
    }
}
// Get elements
let colorInput = null;
let colorPreview = null;

// Update color preview when input changes
colorInput.addEventListener('input', function() {
    colorPreview.style.backgroundColor = colorInput.value;
});

// Creating map options
let mapOptions = {
    center: [17.385044, 78.486671],
    zoom: 10
}

// Creating a map object
// let map = new L.map('map', mapOptions);
//
// // Creating a Layer object
// let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
// // Adding layer to the map
// map.addLayer(layer);