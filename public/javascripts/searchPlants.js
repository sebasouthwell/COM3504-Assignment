
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

