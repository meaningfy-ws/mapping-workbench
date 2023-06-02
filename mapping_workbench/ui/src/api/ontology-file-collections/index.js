import {FileCollectionsApi} from "../file-collections";

class OntologyFileCollectionsApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "Ontology File Collections";
    }

    get SECTION_ITEM_TITLE() {
        return "Ontology File Collection";
    }

    constructor() {
        super("ontology_file_collections");
    }
}

export const ontologyFileCollectionsApi = new OntologyFileCollectionsApi();
