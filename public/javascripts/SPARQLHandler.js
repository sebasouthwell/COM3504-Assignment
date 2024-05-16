
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

function ListPlants() {
    return new Promise((resolve, reject) => {

        // The DBpedia SPARQL endpoint URL
        const endpointUrl = 'https://dbpedia.org/sparql';

        // The SPARQL query to retrieve data for the given resource
        const sparqlQuery = ` 
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>

        SELECT DISTINCT ?plant
        WHERE {
            ?plant a dbo:Plant .
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
                console.log(result);
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });


}

// document.addEventListener('DOMContentLoaded', function () {
//     const searchInput = document.getElementById('DBpediaName');
//     const dropdown = document.getElementById('DBpediaDropdownList');
//
//     ListPlants().then(plants => {
//
//     })
// })