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

    async getCMStatuses() {
        let endpoint = this.paths['statuses'];
        let params = {}
        params['project_id'] = sessionApi.getSessionProject();
        return appApi.get(endpoint, params);
    }

    async getPropertyData() {
        return {
                "class": [
                    "epo:Notice",
                    "epo:CompetitionNotice",
                    "xsd:boolean",
                    "epo:ProcurementServiceProvider",
                    "epo:Procedure",
                    "rdf:PlainLiteral",
                    "rdf:langString",
                    "epo:ExclusionGround",
                    "xsd:decimal"
                ],
                "property": [
                    "epo:hasNoticeType",
                    "epo:refersToProcedure",
                    "epo:hasOfficialLanguage",
                    "epo:hasPublicationDate",
                    "epo:hasLegalBasis",
                    "epo:hasLegalBasisDescription",
                    "epo:definesSpecificPlaceOfPerformance",
                    "epo:foreseesContractSpecificTerm",
                    "epo:hasBroadPlaceOfPerformance"
                ],
                "controlled_list": [
                    "at-voc:language",
                    "at-voc:main-activity",
                    "at-voc:legal-basis",
                    "at-voc:number-threshold",
                    "at-voc:country",
                    "at-voc:number-fixed",
                    "at-voc:nuts",
                    "at-voc:other-place-service",
                    "at-voc:criterion"
                ]
        }
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
