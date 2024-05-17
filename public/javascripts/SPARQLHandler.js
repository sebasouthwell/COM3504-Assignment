
async function SPARQL(query,endpoint = 'https://dbpedia.org/sparql'){
    let encodedQuery = encodeURIComponent(query);
    let queryURL = `${endpoint}?query=${encodedQuery}&format=json`;
    try{
        let response = await fetch(queryURL);
        if (response.ok){
            let data = await response.json();
            if (data['results']){
                return data.results.bindings;
            }
        }
        else{
            return [];
        }
    }
    catch(error){
        console.log(error);
        return [];
    }
}

function extractResource(resource){
    if (resource.includes('/')){
        let url = new URL(resource);
        let path = url.pathname.split('/');
        resource = path[path.length - 1];
    }
    return resource;
}
async function DBpediaQuery(resource){
    resource = extractResource(resource);
    let query = ` 
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
    
        SELECT ?label ?abstract ?uri ?scientific
        WHERE {
            BIND(dbr:${resource} AS ?uri)
            ?uri rdfs:label ?label .
            ?uri dbo:abstract ?abstract .
            ?uri dbp:taxon ?scientific .
            ?uri rdf:type dbo:Plant .
            FILTER (langMatches(lang(?label), "en")) .
            FILTER (langMatches(lang(?abstract ), "en")) .
        }`;
    let results = await SPARQL(query);
    return results;
}


async function listPlants() {
    let query = ` 
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
    
        SELECT ?label ?abstract ?uri ?scientific
        WHERE {
            ?uri rdfs:label ?label .
            ?uri dbo:abstract ?abstract .
            ?uri dbp:taxon ?scientific .
            ?uri rdf:type dbo:Plant .
            FILTER (langMatches(lang(?label), "en")) .
            FILTER (langMatches(lang(?abstract ), "en")) .
        }`;
    let results = await SPARQL(query);
    return results;
}