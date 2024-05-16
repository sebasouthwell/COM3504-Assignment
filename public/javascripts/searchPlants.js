let sort = false
function setSort(value){
    sort = value
    document.getElementById("dropdownSearch").innerHTML = "" + document.getElementById(value).innerHTML + "";
}
function redirectPage() {
    const queryString = new URLSearchParams(window.location.search);
    queryString.set('f', document.getElementById('fruit').checked);
    queryString.set('fl', document.getElementById('flowers').checked);
    queryString.set('i', document.getElementById('identified').checked);
    queryString.set('p', document.getElementById('pending').checked);
    queryString.set('radius', document.getElementById('radius').value);
    queryString.set('name', document.getElementById('plantName').value);
    queryString.set('sort', sort);
    history.replaceState(null, null, "?" + queryString.toString());
}

window.addEventListener('load', () => {
    var sightings = document.getElementById('sightings');
    var template = document.querySelector('#template');
    handler.getAll('sightings', (result) => {
        if (!(result === undefined || result.length === 0)){
            for (let i = 0; i < result.length; i++){
                let res = result[i];
                let copy = template.cloneNode(true);
                copy.classList.remove('hidden');
                let innerHTML = copy.innerHTML;
                innerHTML = innerHTML.replace('?id=',"?id=" + res['_id']);
                innerHTML = innerHTML.replace('NamePlant', res['givenName']);
                innerHTML = innerHTML.replace('ReporterName', res['userNickName']);
                innerHTML = innerHTML.replace('SightDate', new Date(res['dateTime']).toString().substring(0,24));
                innerHTML = innerHTML.replace('LatLong',res['lat']+","+res['long']);
                if (res['photo'] === undefined || res['photo'] === null){
                    innerHTML = innerHTML.replace('plantImage', 'https://hips.hearstapps.com/hmg-prod/images/high-angle-view-of-variety-of-succulent-plants-royalty-free-image-1584462052.jpg');
                }
                else{
                    innerHTML = innerHTML.replace('plantImage', res['photo']);
                }
                copy.innerHTML = innerHTML;
                let seed = copy.querySelector('.seed_view')
                let flower = copy.querySelector('.flower_view');
                let fruit = copy.querySelector('.fruit_view');
                if (!res['hasSeeds']){
                    seed.remove();
                }
                if (!res['hasFlowers']){
                    flower.remove();
                }else{
                    let style = 'background-color: ' + res['flowerColour'] + " !important";
                    flower.style = style;
                    flower.children[0].style = style;
                }
                if (!res['hasFruit']){
                    fruit.remove();
                }
                sightings.appendChild(copy);
            }
        }else if (sightings.children.length === 0){
            let h3 = document.createElement("h3");
            h3.innerHTML = 'No sightings found';
            h3.id = 'notFoundSightings';
            sightings.appendChild(h3);
        }
    })});