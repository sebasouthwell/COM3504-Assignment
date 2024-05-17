let localSighting = null;
//Loads plants locally and prefils the innerhtml
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    handler.request(sightings,id,(result) => {
      if (result === undefined) {
          location.pathname = "/";
      }
      else{
          $('#suggestion_field')[0].remove()
          $('#dbpedia_info')[0].remove();
          $('#sightingNick')[0].innerHTML = 'Seen by: ' + result['userNickName'];
          $('#sightingGiven')[0].innerHTML = 'Name: '+ result['givenName'];
          $('#sightingDesc')[0].innerHTML = 'Description: '+ result['description'];
          $('#sightingLoc')[0].innerHTML = 'Location: ' + result['lat'] + ", " + result['long']
          $('#sightingDate')[0].innerHTML = 'Sighting on '+ new Date(result['dateTime']).toString().substring(0,24)
          $('#sightingExposure')[0].innerHTML = 'Sun exposure: ' + result['sunExposureLevel']
          $('#sightingStatus')[0].innerHTML = 'Status: ' + result['identificationStatus']
          console.log(result);
          if (result['hasFlowers'] === false){
              document.getElementById('sightingFlower').remove();
          }
          else{
              document.getElementById('sightingFlower').children[0].style = "background-color: " + result['flowerColour'] +" !important;"
          }
          if (result['hasFruit'] === false){
              document.getElementById('sightingFruits').remove();
          }
          if (result['hasSeeds'] === false){
              document.getElementById('sightingSeeds').remove();
          }
          $('#sightingHeight')[0].innerHTML = 'Height: ' + result['plantEstHeight'] + "cm";
          $('#sightingSpread')[0].innerHTML = 'Spread: '+ result['plantEstSpread'] + "cm";
          $('#sightingHeight1')[0].innerHTML = $('#sightingHeight')[0].innerHTML
          $('#sightingSpread1')[0].innerHTML = $('#sightingSpread')[0].innerHTML
          if (result['photo'] === undefined || result['photo'] === null){
              $('#sightingPhoto')[0].src = "https://hips.hearstapps.com/hmg-prod/images/high-angle-view-of-variety-of-succulent-plants-royalty-free-image-1584462052.jpg"
          }
          else{
              $('#sightingPhoto')[0].src = result['photo'];
          }
          $('#sightingPhoto1')[0].src = $('#sightingPhoto')[0].src
      }
    })

})