window.addEventListener('load', function() {
  var location = document.getElementById('location');
  if (location) {
    location.addEventListener('change', function() {
      if (location.value) {
        window.location = '/location/' + location.value;
      } else {
        window.location = '/';
      }
    });
  }
}