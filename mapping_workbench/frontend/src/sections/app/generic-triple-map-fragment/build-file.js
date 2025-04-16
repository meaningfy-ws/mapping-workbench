const buildFile = () => {
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

    console.log({defaultPrefixes})
}

export default buildFile