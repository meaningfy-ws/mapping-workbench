const $rdf = require('rdflib');

const rdflibConverter = (rdfData) => {
    const store = $rdf.graph();
    const baseURI = 'http://example.org/'
    const contentType = 'text/turtle';

    $rdf.parse(rdfData, store, baseURI, contentType);

    const subjects = store.subjects(null, null, null);
    subjects.forEach(s => console.log(s.value));
}

export default rdflibConverter