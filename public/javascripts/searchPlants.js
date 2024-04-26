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