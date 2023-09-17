import {SectionApi} from "../section";

class OntologyNamespacesApi extends SectionApi {
    get SECTION_TITLE() {
        return "Ontology Namespaces";
    }

    get SECTION_ITEM_TITLE() {
        return "Ontology Namespace";
    }

    constructor() {
        super("ontology_namespaces");
    }
}

export const ontologyNamespacesApi = new OntologyNamespacesApi();
