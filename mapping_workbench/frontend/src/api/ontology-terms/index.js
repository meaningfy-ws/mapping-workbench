import {SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

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
        this.isProjectResource = true;
    }

    discoverTerms(request) {
        try {
            let endpoint = this.paths['discover_terms'];
            let filters = {}
            filters['project'] = sessionApi.getSessionProject();
            return appApi.post(endpoint, filters);
        } catch (err) {
        }
    }
}

export const ontologyTermsApi = new OntologyTermsApi();
