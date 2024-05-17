import {SectionApi} from "../section";

class OntologyNamespacesCustomApi extends SectionApi {
    get SECTION_TITLE() {
        return "Custom Namespaces";
    }

    get SECTION_ITEM_TITLE() {
        return "Custom Namespace";
    }

    constructor() {
        super("ontology_namespaces_custom");
        this.isProjectResource = false;
    }
}

export const ontologyNamespacesCustomApi = new OntologyNamespacesCustomApi();
