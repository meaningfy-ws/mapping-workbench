const $rdf = require('rdflib');
import prefixes from './prefixes.json'


const injectPrefix = (value) => {
    let res = ""
    Object.entries(prefixes).some(([prefix, uri]) => {
        if (value?.includes(uri)) {
            res = value.replace(uri, prefix + ":")
        }
    })
    return res ?? value
}

const tripleMapQuery = `PREFIX rr: <http://www.w3.org/ns/r2rml#>
            SELECT * where {
                ?newTMap a rr:TriplesMap .
            }`

const tripleMapResults = (results, result) => {
    const value = {...result['?newTMap']}.value
    const tedm = 'http://data.europa.eu/a4g/mapping/sf-rml/'
    const replaceValue = value.replace(tedm, 'tedm:')

    return results.push(replaceValue);
}

const sourceQuery = (uri) => `
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

const sourceResults = (results, result) => {
    const currentType = (type) => {
        if (type.endsWith('ql#XPath'))
            return 'ql:XPath'
        if (type.endsWith('ql#JSONPath'))
            return 'ql:JSONPath'
        return 'ql:CSV'
    }

    return results.push({
        file: result['?file'].value,
        type: currentType(result['?type'].value),
        iterator: result['?iterator'].value
    });
}


const subjectQuery = (uri) => `
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

const subjectResults = (results, result) => {
    const sclass = result['?class']?.value
    return results.push({
        label: result['?sMapLabel']?.value,
        sclass: injectPrefix(sclass),
        template: result['?sRef']?.value,
        type: result['?sRef']?.value ? 'conditional' : 'plain',
        ...result
    })
}

const predicateQuery = (uri) => `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rml: <http://semweb.mmlab.be/ns/rml#>
    PREFIX rr: <http://www.w3.org/ns/r2rml#>
    PREFIX tedm: <http://data.europa.eu/a4g/mapping/sf-rml/>
    
    SELECT ?predicate ?pOMapLabel ?pOMapComment ?reference ?parent ?oLabel ?condition WHERE {
        ${uri} a rr:TriplesMap ;
            rr:predicateObjectMap ?pOMap .
            
        ?pOMap rr:predicate ?predicate ;
            rr:objectMap ?oMap .
            
            
        OPTIONAL { ?pOMap rdfs:label ?pOMapLabel . }
        OPTIONAL { ?pOMap rdfs:comment ?pOMapComment . }
        OPTIONAL { ?oMap rml:reference ?reference . }
        OPTIONAL { ?oMap rr:parentTriplesMap ?parent . }
        OPTIONAL { ?oMap rdfs:label ?oLabel . }
        OPTIONAL {  ?oMap rr:joinCondition ?condition .
        ?condition rr:child ?conditionChild . 
        ?condition rr:parent ?conditionParent . } 
        OPTIONAL { ?oMap  tedm:minSDKVersion ?minSDKVersion . }
        OPTIONAL { ?oMap  tedm:maxSDKVersion ?maxSDKVersion . }
        OPTIONAL { ?oMap  rr:datatype  ?datatype . }
    }`

// tedm:MG-AccessTerm-isSubjectToLotSpecificTerm-Lot_ND-LotProcurementDocument


const predicateResults = (results, result) => {
    const predicate = result['?predicate']?.value
    const parent = result['?parent']?.value
    const datatype = result['?datatype']?.value
    injectPrefix(parent ?? "")

    return results.push({
        predicate:  injectPrefix(predicate),
        label: result['?pOMapLabel']?.value,
        comment: result['?pOMapComment']?.value,
        parent: injectPrefix(parent ?? ""),
        oMapLabel: result['?oLabel']?.value,
        oMapMinSDK: result['?minSDKVersion']?.value,
        oMapMaxSDK: result['?maxSDKVersion']?.value,
        oMapReference: result['?reference']?.value,
        oMapDatatype: injectPrefix(datatype),
        type: parent ? 'relationship' : 'attribute',
        joinChild : result['?conditionChild']?.value,
        joinParent : result['?conditionParent']?.value,
        ...result
    });
}


export const getGraph = async (rdfData, query, mapResults) => {
    const store = $rdf.graph();
    const baseURI = 'https://example.org/'
    const contentType = 'text/turtle';

    const queryEngine = $rdf.SPARQLToQuery(query, false, store);

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
                    mapResults(results, result)
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

export const getTripleMap = (rdfData) => getGraph(rdfData, tripleMapQuery, tripleMapResults)

export const getSource = (rdfData, uri) => getGraph(rdfData, sourceQuery(uri), sourceResults)

export const getSubject = (rdfData, uri) => getGraph(rdfData, subjectQuery(uri), subjectResults)

export const getPredicate = (rdfData, uri) => getGraph(rdfData, predicateQuery(uri), predicateResults)



