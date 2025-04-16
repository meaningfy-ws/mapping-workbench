const $rdf = require('rdflib');

export const getSource = async (rdfData, uri) => {
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

    console.log(queryStr)


    const queryEngine = $rdf.SPARQLToQuery(queryStr, false, store);


    try {
        $rdf.parse(rdfData, store, baseURI, contentType);
    } catch (err) {
        console.error(err)
    }


    const queryToArray = (store, query) => {
        return new Promise((resolve, reject) => {
            const results = [];

            try {
                store.query(query, result => {
                    results.push({
                        file: result['?file'].value,
                        type: result['?type'].value,
                        iterator: result['?iterator'].value
                    });
                }, null, () => {
                    resolve(results); // Called after the query completes
                });
            } catch (err) {
                reject(err);
            }
        });
    }


    return queryToArray(store, queryEngine)
}


export const getSubject = (rdfData, uri) => {
    const store = $rdf.graph();
    const baseURI = 'https://example.org/'
    const contentType = 'text/turtle';

    //we may need to make sMap optional for versioned mappings
    const queryStr = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rml: <http://semweb.mmlab.be/ns/rml#>
        PREFIX rr: <http://www.w3.org/ns/r2rml#>
        PREFIX tedm: <http://data.europa.eu/a4g/mapping/sf-rml/>
       SELECT ?sMapLabel ?template ?sRef ?class WHERE {
    ${uri} a rr:TriplesMap ;
    rr:subjectMap ?sMap .
        OPTIONAL { ?sMap rdfs:label ?sMapLabel . }
        OPTIONAL { ?sMap rr:template ?template . }
        OPTIONAL { ?sMap rml:reference ?sRef . }
        OPTIONAL { ?sMap rr:class ?class . }
}`

    console.log(queryStr)


    const queryEngine = $rdf.SPARQLToQuery(queryStr, false, store);


    try {
       $rdf.parse(rdfData, store, baseURI, contentType);
    } catch (err) {
        console.error(err)
    }



    const queryToArray = (store, query) => {
        return new Promise((resolve, reject) => {
            const results = [];

            try {
                store.query(query, result => {
                    console.log('rr',result)
                    results.push(result);
                }, null, () => {
                    resolve(results); // Called after the query completes
                });
            } catch (err) {
                reject(err);
            }
        });
    }


    return queryToArray(store, queryEngine)
}



export const getPredicate = (rdfData, uri) => {
    const store = $rdf.graph();
    const baseURI = 'https://example.org/'
    const contentType = 'text/turtle';

    const queryStr = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rml: <http://semweb.mmlab.be/ns/rml#>
    PREFIX rr: <http://www.w3.org/ns/r2rml#>
    PREFIX tedm: <http://data.europa.eu/a4g/mapping/sf-rml/>
    
    SELECT ?predicate ?pOMapLabel ?pOMapComment ?reference ?parent WHERE {
        ${uri} a rr:TriplesMap ;
            rr:predicateObjectMap ?pOMap .
            
        ?pOMap rr:predicate ?predicate ;
            rr:objectMap ?oMap .
    
        OPTIONAL { ?pOMap rdfs:label ?pOMapLabel . }
        OPTIONAL { ?pOMap rdfs:comment ?pOMapComment . }
        OPTIONAL { ?oMap rml:reference ?reference . }
        OPTIONAL { ?oMap rr:parentTriplesMap ?parent . }
    }`

    console.log(queryStr)


    const queryEngine = $rdf.SPARQLToQuery(queryStr, false, store);


    try {
       $rdf.parse(rdfData, store, baseURI, contentType);
    } catch (err) {
        console.error(err)
    }



    const queryToArray = (store, query) => {
        return new Promise((resolve, reject) => {
            const results = [];

            try {
                store.query(query, result => {
                    console.log('rr',result)
                    results.push(result);
                }, null, () => {
                    resolve(results); // Called after the query completes
                });
            } catch (err) {
                reject(err);
            }
        });
    }


    return queryToArray(store, queryEngine)
}

export const getTripleMap = (rdfData) => {
    const store = $rdf.graph();
    const baseURI = 'https://example.org/'
    const contentType = 'text/turtle';

    const queryStr =
        `PREFIX rr: <http://www.w3.org/ns/r2rml#>
            SELECT * where {
                ?newTMap a rr:TriplesMap .
            }`


    const queryEngine = $rdf.SPARQLToQuery(queryStr, false, store);

    const queryToArray = (store, query) => {
        return new Promise((resolve, reject) => {
            const results = [];

            try {
                store.query(query, result => {
                    const value = {...result['?newTMap']}.value
                    const tedm = 'http://data.europa.eu/a4g/mapping/sf-rml/'
                    const replaceValue = value.replace(tedm, 'tedm:')
                    results.push(replaceValue);
                }, null, () => {
                    resolve(results); // Called after the query completes
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    try {
        $rdf.parse(rdfData, store, baseURI, contentType);
    } catch (err) {
        console.error(err)
    }

    return queryToArray(store, queryEngine)

}


