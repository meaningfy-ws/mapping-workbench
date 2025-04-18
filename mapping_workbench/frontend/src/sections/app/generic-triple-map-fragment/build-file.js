const defaultPrefixes = "@prefix owl: <http://www.w3.org/2002/07/owl#> .\n" +
    "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n" +
    "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n" +
    "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n" +
    "@prefix rr: <http://www.w3.org/ns/r2rml#> .\n" +
    "@prefix rml: <http://semweb.mmlab.be/ns/rml#> .\n" +
    "@prefix ql: <http://semweb.mmlab.be/ns/ql#> .\n" +
    "@prefix locn: <http://www.w3.org/ns/locn#> .\n" +
    "@prefix dct: <http://purl.org/dc/terms/> .\n" +
    "@prefix tedm: <http://data.europa.eu/a4g/mapping/sf-rml/> .\n" +
    "@prefix epd: <http://data.europa.eu/a4g/resource/> .\n" +
    "@prefix epo: <http://data.europa.eu/a4g/ontology#> .\n" +
    "@prefix epo-not: <http://data.europa.eu/a4g/ontology#>.\n" +
    "@prefix cv: <http://data.europa.eu/m8g/> .\n" +
    "@prefix cccev: <http://data.europa.eu/m8g/> .\n" +
    "@prefix org: <http://www.w3.org/ns/org#> .\n" +
    "@prefix cpov: <http://data.europa.eu/m8g/> .\n" +
    "@prefix\tfoaf: <http://xmlns.com/foaf/0.1/> .\n" +
    "@prefix time: <http://www.w3.org/2006/time#>.\n" +
    "@prefix adms: <http://www.w3.org/ns/adms#> .\n" +
    "@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n" +
    "@prefix fnml:   <http://semweb.mmlab.be/ns/fnml#> .\n" +
    "@prefix fno: <https://w3id.org/function/ontology#> .\n" +
    "@prefix idlab-fn: <http://example.com/idlab/function/> ."

const buildSource = (source) => {
    let sourceValues = ''
    if (source.file)
        sourceValues += `\n             rml:source "${source.file}" ;`
    if (source.iterator)
        sourceValues += `\n             rml:iterator "${source.iterator}" ;`
    if (source.type)
        sourceValues += `\n             rml:referenceFormulation ${source.type}`
    return `\n    rml:logicalSource\n        [${sourceValues}\n        ];`
}

const buildSubject = (subject) => {
    let subjectValues = ''
    if (subject.label)
        subjectValues += `\n              rdfs:label "${subject.label}" ;`
    if (subject.template)
        subjectValues += `\n              rml:reference "${subject.template}" ;`
    if (subject.sclass)
        subjectValues += `\n              rr:class cccev:${subject.sclass}`
    return `\n    rr:subjectMap\n        [${subjectValues}\n        ];`
}

const buildPredicate = (predicate) => {
    let predicateValues = ''
    let predicateObject = ''
    if (predicate.label)
        predicateValues += `\n              rdfs:label "${predicate.label}" ;`
    if (predicate.comment)
        predicateValues += `\n              rdfs:comment "${predicate.comment}" ;`
    if (predicate.predicate) {
        predicateValues += `\n              rr:predicate epo:${predicate.predicate} ;`
    }

    if (predicate.oMapMinSDK)
        predicateObject += `\n                       tedm:minSDKVersion "${predicate.oMapMinSDK}" ;`
    if (predicate.oMapMaxSDK)
        predicateObject += `\n                       tedm:maxSDKVersion "${predicate.oMapMaxSDK}" ;`
    if (predicate.oMapLabel)
        predicateObject += `\n                       rdfs:label "${predicate.oMapLabel}" ;`
    if (predicate.parent)
        predicateObject += `\n                       rr:parentTriplesMap tedm:${predicate.parent} ;`
    if (predicate.oMapReference)
        predicateObject += `\n                       rml:reference "${predicate.oMapReference}" ;`
    if (predicate.oMapDatatype)
        predicateObject += `\n                       rr:datatype xsd:${predicate.oMapDatatype} ;`
    if (predicateObject)
        predicateValues += `\n              rr:objectMap\n                   [${predicateObject}\n                   ];`

    return `\n    rr:predicateObjectMap\n        [${predicateValues}\n        ];`
}

const buildFile = (processedTripleMaps) => {
    console.log(processedTripleMaps)
    let outStr = defaultPrefixes
    Object.entries(processedTripleMaps).forEach(processedTriple => {
        console.log(processedTriple)
        const [tripleName, values] = processedTriple
        outStr += `\n\n${tripleName}`
        values.sources.forEach(source => {
            outStr += buildSource(source)
        })
        values.subjects.forEach(subject => {
            outStr += buildSubject(subject)
        })
        values.predicates.forEach(predicate => {
            outStr += buildPredicate(predicate)
        })
        outStr += '\n.'
    })

    return outStr
}

export default buildFile