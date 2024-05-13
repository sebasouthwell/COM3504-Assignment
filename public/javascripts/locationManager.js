window.addEventListener('load',()=>{
  getMapLocationSupported();
  geoLocationSupported();
});
function geoLocationSupported() {
  let locButton = document.getElementById('get_location')
  if (navigator.geolocation) {
    console.log("Geolocation is supported by this browser :)");
    if (locButton) {
      locButton.classList.remove('hidden');
    }
  } else {
    console.log("Geolocation is NOT supported by this browser :(");
  }
  return navigator.geolocation;
}

function getMapLocationSupported(){
  let mapLocButton = document.getElementById('get_map_location');
  let map = document.getElementById('openstreetmap_view');
  // Check if has internet access to render map
  fetch('https://www.openstreetmap.org/export/embed.html?bbox=-74.057,-2.857,75.547,2.657&layer=mapnik', {
    mode: 'no-cors'
  }).then(
      r =>{
        console.log("Rendering map");
        if (mapLocButton) {
          mapLocButton.classList.remove('hidden');
        }
        if (map) {
          map.classList.remove('hidden');
        }
        return true;
      }
    ).catch(e=>{
      console.log("Could not access OpenStreetMap");
      return false;
  })
}


function getLocation(lat_class, long_class,locButtonId=undefined) {
  let locButton;
  if (locButtonId) {
    locButton = document.getElementById(locButtonId);
  }
  if (navigator.geolocation) {
    if (locButton) {
      locButton.classList.add('hidden');
    }
    navigator.geolocation.getCurrentPosition(function(result) {
      document.getElementsByClassName(lat_class)[0].value = result.coords.latitude;
      document.getElementsByClassName(long_class)[0].value = result.coords.longitude;
    });
    if (locButton) {
      locButton.classList.remove('hidden');
    }
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(function(result) {
    lat = result.coords.latitude; // latitude value
    long = result.coords.longitude; // longitude value
  });
}

function getMapLocation(){
  let map = document.getElementById('openstreetmap_view');
  let src = map.getAttribute('src');
  console.log(src);
  // Extracting location top right and bottom left from the view box
  let bbox = src.split('bbox=')[1].split('&')[0].split(',');
  console.log(bbox);
}