let localSighting = null;

window.addEventListener('load', () => {
    onlineStatusAsync().then(
        (status) => {
            if (!status){
                console.log('Offline no suggestions');
                $('#suggestion_field')[0].remove()
            }
            else if (navigator.onLine){
                let plant_select = $('#DBpediaName')[0];
                let manualInput = $('#manualDBPedia')[0];
                let dbPediaURL = $('#DBpediaURL')[0];
                let plant_name = $('#PlantName')[0];
                let dbDisplay = $('#dbpedia_info')[0];
                $('#suggest_form')[0].addEventListener('submit',sendSuggestion);
                let plant_list = listPlants().then((plants) =>{
                    if (plants.length > 0){
                        for (let plant of plants){
                            let option = document.createElement('option');
                            option.text = plant.label.value;
                            option.value = plant.uri.value;
                            plant_select.add(option);
                        }
                        dbPediaURL.disabled = true;
                        plant_name.disabled = true;
                        document.getElementById('manualDBPedia').addEventListener('change', function(e) {
                            if (e.target.checked){
                                plant_select.disabled = true;
                                dbPediaURL.disabled = false;
                                plant_name.disabled = false;
                            }
                            else{
                                plant_select.disabled = false;
                                dbPediaURL.disabled = true;
                                plant_name.disabled = true;
                            }
                        });
                    }
                    else{
                        plant_select.remove();
                        manualInput.remove();
                    }
                })
                let dbURL =dbDisplay.innerHTML;
                if (dbURL.length > 0){
                    DBpediaQuery(dbURL).then(r => {
                        if (r.length > 0){
                            console.log(r);
                            dbDisplay.innerHTML = `<div><h4>DBPedia Information</h4><table class="table">
<tr><th scope="col">Common Name</th><th scope="col">Scientific Name</th><th scope="col">URI</th><th scope="col">Abstract</th><tr>
<tr><td>${r[0].label.value}</td><td>${r[0].scientific.value}</td><td><a class="p-1" href="${dbURL}"><br>DBPedia URL</a></td><td><p class="p-2">${r[0].abstract.value} </p></td></tr>
</table></div>
`
                        }
                    })
                }
            }
            else{
                manualInput.remove();
            }
        }
    );
});