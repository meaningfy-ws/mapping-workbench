const $rdf = require('rdflib');

export const getSource = (rdfData,uri) => {
    let tmap = []
    const store = $rdf.graph();
    const baseURI = 'https://example.org/'
    const contentType = 'text/turtle';

    const queryStr = `
        PREFIX rml: <http://semweb.mmlab.be/ns/rml#>
        PREFIX rr: <http://www.w3.org/ns/r2rml#>
        PREFIX ql: <http://semweb.mmlab.be/ns/ql#>
        PREFIX tedm: <http://data.europa.eu/a4g/mapping/sf-rml/>
        SELECT ?file ?iterator ?type WHERE {
            ${uri} a rr:TriplesMap ; 
            rml:logicalSource ?source .
            ?source rml:source ?file ;
            rml:iterator ?iterator ;
            rml:referenceFormulation ?type .
        }`


    const queryEngine = $rdf.SPARQLToQuery(queryStr, false, store);


    try {
        $rdf.parse(rdfData, store, baseURI, contentType);
    } catch (err) {
        console.error(err)
    }

    store.query(queryEngine, (bindings) => {
        return bindings
    });
}


export const getTripleMap = (rdfData) => {
    let tmap = []
    const store = $rdf.graph();
    const baseURI = 'https://example.org/'
    const contentType = 'text/turtle';

    const queryStr =
        `PREFIX rr: <http://www.w3.org/ns/r2rml#>
        SELECT * where {
     ?newTMap a rr:TriplesMap .
 }`


    const queryEngine = $rdf.SPARQLToQuery(queryStr, false, store);


    try {
        $rdf.parse(rdfData, store, baseURI, contentType);
    } catch (err) {
        console.error(err)
    }

    store.query(queryEngine, (bindings) => {
        const value = {...bindings['?newTMap']}.value
        const tedm = 'http://data.europa.eu/a4g/mapping/sf-rml/'
        const replaceValue = value.replace(tedm, 'tedm:')
        tmap.push(replaceValue); // Output the results
        // tmap.push(bindings.value)
    });
    return tmap
}


