window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    handler.request(sightings,id,(result) => {
      if (result === undefined) {
          location.pathname = "/";
      }
      else{
          $('#sightingNick')[0].innerHTML = 'Seen by: ' + result['userNickName'];
          $('#sightingGiven')[0].innerHTML = 'Name: '+ result['givenName'];
          $('#sightingDesc')[0].innerHTML = 'Description: '+ result['description'];
          $('#sightingLoc')[0].innerHTML = 'Location: ' + result['lat'] + ", " + result['long']
          $('#sightingDate')[0].innerHTML = 'Sighting on '+ new Date(result['dateTime']).toString().substring(0,24)
          $('#sightingExposure')[0].innerHTML = 'Sun exposure: ' + result['sunExposureLevel']
          $('#sightingStatus')[0].innerHTML = 'Status: ' + result['identificationStatus']
          if (!result['hasFlowers']){
              document.getElementById('sightingFlower').delete();
          }
          else{
              document.getElementById('sightingFlower').children[0].style = "background-color: " + result['flowerColour'] +" !important;"
          }
          if (!result['hasFruit']){
              document.getElementById('sightingFruit').delete();
          }
          if (!result['hasSeeds']){
              document.getElementById('sightingSeeds').delete();
          }
          $('#sightingHeight')[0].innerHTML = 'Height: ' + result['plantEstHeight'] + "cm";
          $('#sightingSpread')[0].innerHTML = 'Spread: '+ result['plantEstSpread'] + "cm";
          if (result['photo'] === undefined || result['photo'] === null){
              $('#sightingPhoto')[0].src = "https://hips.hearstapps.com/hmg-prod/images/high-angle-view-of-variety-of-succulent-plants-royalty-free-image-1584462052.jpg"
          }
          else{
              $('#sightingPhoto')[0].src = result['photo'];
          }

      }
    })

})