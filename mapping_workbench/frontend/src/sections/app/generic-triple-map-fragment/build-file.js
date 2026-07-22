import prefixes from './prefixes.json'

const defaultPrefixes = Object.entries(prefixes).map(([prefix,uri]) => `@prefix ${prefix}: <${uri}> .\n`).join('')

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
        subjectValues += `\n              rr:class ${subject.sclass}`
    return `\n    rr:subjectMap\n        [${subjectValues}\n        ];`
}

const buildPredicate = (predicate) => {
    let predicateValues = ''
    if (predicate.label)
        predicateValues += `\n              rdfs:label "${predicate.label}" ;`
    if (predicate.comment)
        predicateValues += `\n              rdfs:comment "${predicate.comment}" ;`
    if (predicate.predicate)
        predicateValues += `\n              rr:predicate ${predicate.predicate} ;`

    let predicateObject = ''
    if (predicate.oMapMinSDK)
        predicateObject += `\n                       tedm:minSDKVersion "${predicate.oMapMinSDK}" ;`
    if (predicate.oMapMaxSDK)
        predicateObject += `\n                       tedm:maxSDKVersion "${predicate.oMapMaxSDK}" ;`
    if (predicate.oMapLabel)
        predicateObject += `\n                       rdfs:label "${predicate.oMapLabel}" ;`
    if (predicate.parent)
        predicateObject += `\n                       rr:parentTriplesMap ${predicate.parent} ;`
    if (predicate.oMapReference)
        predicateObject += `\n                       rml:reference "${predicate.oMapReference}" ;`
    if (predicate.oMapDatatype)
        predicateObject += `\n                       rr:datatype ${predicate.oMapDatatype} ;`
    if (predicate.joinChild && predicate.joinParent) {
        predicateObject += `\n                       rr:joinCondition [
                           rr:child "${predicate.joinChild}" ;
                           rr:parent "${predicate.joinParent}" ;
                       ] ;`
    }
    if (predicateObject)
        predicateValues += `\n              rr:objectMap\n                   [${predicateObject}\n                   ];`


    return `\n    rr:predicateObjectMap\n        [${predicateValues}\n        ];`
}

const buildFile = (processedTripleMaps) => {
    let outStr = defaultPrefixes
    Object.entries(processedTripleMaps).forEach(processedTriple => {
        const [tripleName, values] = processedTriple

        outStr += `\n\n${tripleName}`

        values.sources.forEach(source => outStr += buildSource(source))
        values.subjects.forEach(subject => outStr += buildSubject(subject))
        values.predicates.forEach(predicate => outStr += buildPredicate(predicate))

        outStr += '\n.'
    })

    return outStr
}

export default buildFile