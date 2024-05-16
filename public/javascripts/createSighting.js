// Get elements
let colorInput = null;
let colorPreview = null;
window.addEventListener('load', function () {
    isOnline();
    let date = (new Date()).toISOString();
    date = date.split('T')[0] + " " + date.split('T')[1].split('.')[0];
    $('#dateTime').val(date.substring(0,date.length-3));
    $('#dateTime').datetimepicker();
    $('#dateTime').datetimepicker('setStartDate', '2012-01-01');
    colorInput = document.getElementById('flowerColour');
    colorPreview = document.getElementById('colorPreview');
    colorInput.addEventListener('input', function() {
        colorPreview.style.backgroundColor = colorInput.value;
    });
    // Set initial color preview
    colorPreview.style.backgroundColor = colorInput.value;
    var form = document.getElementById('sightingForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
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
        setTimeout(async function(){
            let sighting = {
                _id: guid, userNickName: name,givenName: $("#givenName").val(),description:$('#description').val(),lat: $('#lat').val(),long: $('#long').val(), plantEstHeight: $('#plantEstHeight').val(), plantEstSpread: $('#plantEstSpread').val(), hasFlowers: $('#hasFlowers').is(':checked'), flowerColour: $('#flowerColour').val(), hasFruit: $('#hasFruit').is(':checked'), hasSeeds: $('#hasSeeds').is(':checked'), sunExposureLevel: $('#sunExposureLevel').val(), dateTime: $('#dateTime').val(), identificationStatus: $('#identificationStatus').val(), photo: imageString, chat: []
            }
            if (onlineStatus){
                console.log(sighting)
                uploadSighting(sighting,[],imageString).then(
                (id) => {
                    if (id){
                        window.location.href = window.origin + '/sight_view/' + id;
                    }else {
                        handler.update(sightings,guid,sighting,() => {
                            makeNotification('Could not upload sighting.', {body: 'Your sighting has been saved to you browser and will be uploaded once you regain server connection'});
                        })
                        window.location.href = window.origin + '/sight_view?id=' + guid;
                    }
                })
            }
            else if (checkValidity(sighting)){
                handler.update(sightings,guid,sighting,() => {
                    makeNotification('Sighting Saved: Offline Mode', {body: 'You are currently offline, your sighting has been saved to you browser and will be uploaded once you regain server connection'});
                })
                window.location.href = window.origin + '/sight_view?id=' + guid;
            }
        },100);
    });
});

function checkValidity(sighting){
    if (name === undefined || name=== 0){
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

function showColour(){
    if(document.getElementById("colourShow").classList.contains("hidden")){
        document.getElementById("colourShow").classList.remove("hidden");
    }else{
        document.getElementById("colourShow").classList.add("hidden");
    }
}


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