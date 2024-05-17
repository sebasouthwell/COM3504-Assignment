
function setSort(value){
    document.getElementById("sort").value = value;
    document.getElementById("dropdownSearch").innerHTML = "" + document.getElementById(value).innerHTML + "";
}
function redirectPage() {
    const queryString = new URLSearchParams(window.location.search);
    let hasFruit = document.getElementById('fruit').checked;
    let hasFlowers = document.getElementById('flowers').checked;
    let hasSeeds = document.getElementById('seeds').checked;
    if (hasFlowers || hasSeeds || hasFruit){
        queryString.set('hasFruit', hasFruit);
        queryString.set('hasFlowers', hasFlowers);
        queryString.set('hasSeeds', hasSeeds);
    }

    let getIdentified =  document.getElementById('identified').checked;
    let getPending =  document.getElementById('pending').checked;
    // selects all if no boxes are ticked or both are
    if((getIdentified && getPending) || (!getIdentified && !getPending)){

    }else if(getIdentified){
        queryString.set('identificationStatus', 'Identified');
    }else{
        queryString.set('identificationStatus', 'Pending');
    }
    if(document.getElementById('radius').value){
        queryString.set('radius', document.getElementById('radius').value);
    }
    if(document.getElementById('lat').value && document.getElementById('long').value) {
        queryString.set("coords", [document.getElementById('lat').value, document.getElementById('long').value])
    }
    if(document.getElementById('plantName').value){
        queryString.set('givenName', document.getElementById('plantName').value);
    }

    if(document.getElementById("sort").value) {
        queryString.set('sort', document.getElementById("sort").value);
    }

    window.location.href = "?" + queryString.toString();
}
function prefillValues(){
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams)
    document.getElementById("sort").value = urlParams.get('sort');
    document.getElementById("dropdownSearch").innerHTML = document.getElementById( urlParams.get('sort')).innerHTML;
    if(urlParams.get('hasFruit') === 'true'){
        document.getElementById('fruit').checked = true;
    }
    if(urlParams.get('hasFlowers') === 'true'){
        document.getElementById('flowers').checked = true;
    }
    if(urlParams.get('hasSeeds') === 'true'){
        document.getElementById('seeds').checked = true;
    }
    if(urlParams.get('identificationStatus') === 'Identified') {
        document.getElementById('identified').checked = true;
    }
    if(urlParams.get('identificationStatus') === 'Pending'){
        document.getElementById('pending').checked = true;
    }
    if(urlParams.get('radius')){
        document.getElementById('radius').value = urlParams.get('radius');
    }
    if(urlParams.get('givenName')){
        document.getElementById('plantName').value = urlParams.get('givenName');
    }

}


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