import {Types as ol} from "mongoose";

window.addEventListener('load', function () {
    document.getElementById('dateTime').value = new Date().toISOString()
    var form = document.getElementById('sightingForm');
    form.addEventListener('submit', function (event) {
        // Check if online or offline
        if (!navigator.onLine){
            event.preventDefault();
            alert("You are offline, please connect to the internet to submit a sighting");
            var formArray = {}
            for (var i = 0; i < form.length; i++) {
                var element = form.elements[i];
                if (element.type !== 'submit') {
                    formArray[element.name] = element.value;
                }
            }
            if (formArray['photoUpload'] != ""){
                var photoFile = event.target.files[0];
                form
            }
            console.log(formArray);
            createSighting();
        }
    });
});


function createSighting() {
    // Summarises the form via getting innerHTML of the form
    let form = document.getElementById('sightingForm');

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