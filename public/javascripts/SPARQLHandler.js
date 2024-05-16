
function getResourceFromURL(url) {
    // Create a new URL object
    const urlObj = new URL(url);

    // Get the pathname and split it by "/"
    const pathParts = urlObj.pathname.split('/');

    // The resource is the last part of the path
    const resource = pathParts[pathParts.length - 1];

    return resource;
}

function DBpediaSearch(resource) {
    // Resource should be dbpedia resource

    return new Promise((resolve, reject) => {

        // Check to allow dbpedia url input
        if (resource.includes('/')) {
            resource = getResourceFromURL(resource);
        }

        // The DBpedia SPARQL endpoint URL
        const endpointUrl = 'https://dbpedia.org/sparql';

        // The SPARQL query to retrieve data for the given resource
        const sparqlQuery = ` 
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
    
        SELECT ?label ?abstract ?uri
        WHERE {
            BIND(dbr:${resource} AS ?uri)
            ?uri rdfs:label ?label .
            ?uri dbo:abstract ?abstract .
            FILTER (langMatches(lang(?label), "en")) .
            FILTER (langMatches(lang(?abstract ), "en")) .
        }`;

        // Encode the query as a URL parameter
        const encodedQuery = encodeURIComponent(sparqlQuery);

        // Build the URL for the SPARQL query
        const url = `${endpointUrl}?query=${encodedQuery}&format=json`;
        // Use fetch to retrieve the data
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Unable to fetch DBpedia')
                }
                return response.json()
            })
            .then(data => {
                // The results are in the 'data' object
                let bindings = data.results.bindings;
                let result = JSON.stringify(bindings);
                //console.log(result);
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });


}

async function listPlants() {
    return new Promise((resolve, reject) => {

        // The DBpedia SPARQL endpoint URL
        const endpointUrl = 'https://dbpedia.org/sparql';

        // The SPARQL query to retrieve data for the given resource
        const sparqlQuery = ` 
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>

        SELECT DISTINCT ?plant ?label ?abstract
        WHERE {
            ?plant a dbo:Plant .
            ?plant rdfs:label ?label .
            ?plant dbo:abstract ?abstract .
            FILTER (langMatches(lang(?label), "en")) .
            FILTER (langMatches(lang(?abstract ), "en")) .
        }`;

        // Encode the query as a URL parameter
        const encodedQuery = encodeURIComponent(sparqlQuery);

        // Build the URL for the SPARQL query
        const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

        // Use fetch to retrieve the data
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Unable to fetch DBpedia')
                }
                return response.json()
            })
            .then(data => {
                // The results are in the 'data' object
                let bindings = data.results.bindings;
                let result = JSON.stringify(bindings);
                //console.log(result);
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });


}

document.addEventListener('DOMContentLoaded', async () => {
    const plantSearchInput = document.getElementById('DBpediaName');
    const plantDropdown = document.getElementById('DBpediaDropdownList');
    const plantGivenName = document.getElementById('givenName');
    const plantDescription = document.getElementById('description');
    const plantURL = document.getElementById('DBpediaURL');

    let plants = [];
    try {
        plants = JSON.parse(await listPlants());
        //console.log(plants);
    } catch (error) {
        console.error('Error fetching plant data: ', error);
    }

    plantSearchInput.addEventListener('input', function() {
        if (navigator.onLine) {
            const filter = plantSearchInput.value.toUpperCase();
            plantDropdown.innerHTML = '';
            if (!filter) return;

            const filteredPlants = plants.filter(plant => plant.label.value.toUpperCase().includes(filter));
            filteredPlants.forEach(plant => {
                const item = document.createElement('div');
                item.textContent = plant.label.value;
                item.addEventListener('click', function() {
                    plantSearchInput.value = plant.label.value;
                    plantGivenName.value = plant.label.value;
                    plantDescription.value = plant.abstract.value;
                    plantURL.textContent = plant.plant.value;
                    plantURL.href = plant.plant.value;
                    plantDropdown.innerHTML = '';
                });
                plantDropdown.appendChild(item);
            });
        } else {
            alert("DBpedia search unavailable whilst offline");
            plantSearchInput.innerHTML = '';
        }


    });

    document.addEventListener('click', function (event) {
        if (event.target !== plantSearchInput) {
            plantDropdown.innerHTML = '';
        }
    })
});