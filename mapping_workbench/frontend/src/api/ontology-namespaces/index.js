import {SectionApi} from "../section";
import {appApi} from "../app";

class OntologyNamespacesApi extends SectionApi {
    get SECTION_TITLE() {
        return "Ontology Namespaces";
    }

    get SECTION_ITEM_TITLE() {
        return "Ontology Namespace";
    }

    constructor() {
        super("ontology_namespaces");
        this.isProjectResource = true;
    }

    createNamespaces(request) {
        try {
            const endpoint = this.paths['create_namespaces'];
            return appApi.post(endpoint, request, null);
        } catch (err) {
        }
    }

}

export const ontologyNamespacesApi = new OntologyNamespacesApi();
