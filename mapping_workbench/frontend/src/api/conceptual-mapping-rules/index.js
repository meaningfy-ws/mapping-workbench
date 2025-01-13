import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

export const COMMENT_PRIORITY = {
    HIGH: 'high',
    NORMAL: 'normal',
    LOW: 'low'
};

export const COMMENT_TYPE = {
    MAPPING: 'mapping_notes',
    EDITORIAL: 'editorial_notes',
    FEEDBACK: 'feedback_notes'
};

class ConceptualMappingRulesApi extends SectionApi {
    get SECTION_TITLE() {
        return "Conceptual Mapping Rules";
    }

    get SECTION_ITEM_TITLE() {
        return "Conceptual Mapping Rule";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.EDIT, ACTION.DELETE];
    }

    constructor() {
        super("conceptual_mapping_rules");
        this.isProjectResource = true;
    }

    async checkTermsValidity(content) {
        let endpoint = this.paths['check_content_terms_validity'];
        return appApi.post(endpoint, {
            "content": content,
            "project": sessionApi.getSessionProject()
        });
    }

    async searchTerms(q) {
        let endpoint = this.paths['search_terms'];
        return appApi.get(endpoint, {"q": q});
    }

    async getPrefixedTerms(q) {
        let endpoint = this.paths['prefixed_terms'];
        let params = {}
        params['project'] = sessionApi.getSessionProject();
        return appApi.get(endpoint, params);
    }

    async cloneItem(id) {
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

    async generateSHACL(request = {}) {
        const endpoint = this.paths['generate_shacl'];
        request['project_id'] = sessionApi.getSessionProject();
        return appApi.post(endpoint, request)
    }

    async getCMStatuses() {
        let endpoint = this.paths['statuses'];
        let params = {}
        params['project_id'] = sessionApi.getSessionProject();
        return appApi.get(endpoint, params);
    }

    async getNotes(cm_rule_id, comment_type) {
        let endpoint = this.paths[comment_type].replace(':id', cm_rule_id);
        let params = {'project_id': sessionApi.getSessionProject()}
        return appApi.get(endpoint, params);
    }

    async addNote(cm_rule_id, comment_type, comment) {
        let endpoint = this.paths[comment_type].replace(':id', cm_rule_id);
        let data = {}
        data['comment'] = comment
        return appApi.post(endpoint, data, {'project_id': sessionApi.getSessionProject()});
    }
}

export const conceptualMappingRulesApi = new ConceptualMappingRulesApi();
