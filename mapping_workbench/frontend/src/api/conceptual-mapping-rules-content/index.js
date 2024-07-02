import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

export const COMMENT_PRIORITY = {
    HIGH: 'high',
    NORMAL: 'normal',
    LOW: 'low'
};

class ConceptualMappingRulesContentApi extends SectionApi {
    get SECTION_TITLE() {
        return "Conceptual Mapping Rules";
    }

    get SECTION_ITEM_TITLE() {
        return "Conceptual Mapping Rule";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.DELETE];
    }

    constructor() {
        super("conceptual_mapping_rules");
        this.isProjectResource = true;
    }

    async checkTermsValidity(content){
        let endpoint = this.paths['check_content_terms_validity'];
        return appApi.post(endpoint, {
            "content": content,
            "project": sessionApi.getSessionProject()
        });
    }

    async searchTerms(q){
        let endpoint = this.paths['search_terms'];
        return appApi.get(endpoint, {"q": q});
    }

    async getPrefixedTerms(q){
        let endpoint = this.paths['prefixed_terms'];
        let params = {}
        params['project'] = sessionApi.getSessionProject();
        return appApi.get(endpoint, params);
    }

    async cloneItem(id){
        let endpoint = this.paths['clone'].replace(':id', id);
        return appApi.post(endpoint);
    }

    async generateCMAssertionsQueries(request = {}) {
        try {
            let endpoint = this.paths['tasks']['generate_cm_assertions_queries'];
            let filters = {}
            if (request['filters']) {
                filters = request['filters'];
            }
            filters['project'] = sessionApi.getSessionProject();
            return appApi.post(endpoint, filters);
        } catch (err) {
        }
    }

}

export const conceptualMappingRulesContentApi = new ConceptualMappingRulesContentApi();
