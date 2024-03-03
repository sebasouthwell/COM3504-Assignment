window.addEventListener('load', geolocationSupported);
function geolocationSupported() {
  let locButton = document.getElementById('get_location')
  if (navigator.geolocation) {
    console.log("Geolocation is supported by this browser :)");
    locButton.classList.remove('hidden');
  } else {
    console.log("Geolocation is NOT supported by this browser :(");
  }
}


function getLocation(lat_class, long_class) {
  let locButton = document.getElementById('get_location')
  if (navigator.geolocation) {
    locButton.classList.add('hidden');
    navigator.geolocation.getCurrentPosition(function(result) {
      document.getElementsByClassName(lat_class)[0].value = result.coords.latitude;;
      document.getElementsByClassName(long_class)[0].value = result.coords.longitude;;
    });
    locButton.classList.remove('hidden');
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