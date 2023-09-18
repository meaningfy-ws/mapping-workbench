import {SectionApi} from "../section";
import {appApi} from "../app";

class OntologyTermsApi extends SectionApi {
    get SECTION_TITLE() {
        return "Ontology Terms";
    }

    get SECTION_ITEM_TITLE() {
        return "Ontology Term";
    }

    get TERM_TYPES() {
        return {
            "CLASS": "CLASS",
            "PROPERTY": "PROPERTY"
        };
    }

    constructor() {
        super("ontology_terms");
    }

    discoverTerms(request) {
        try {
            let endpoint = this.paths['discover_terms'];
            return appApi.post(endpoint);
        } catch (err) {
        }
    }
}

export const ontologyTermsApi = new OntologyTermsApi();
