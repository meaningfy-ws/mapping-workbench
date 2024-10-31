import {ACTION, SectionApi} from "../section";
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

    get SECTION_LIST_ACTIONS() {
        return [ACTION.DELETE]
    }

    constructor() {
        super("ontology_terms");
        this.isProjectResource = true;
    }

    get DEFAULT_ROWS_PER_PAGE() {
        return 10
    }

    discoverTerms(request) {
        let endpoint = this.paths['discover_terms'];
        let filters = {}
        filters['project'] = sessionApi.getSessionProject();
        return appApi.post(endpoint, filters);
    }
}

export const ontologyTermsApi = new OntologyTermsApi();
