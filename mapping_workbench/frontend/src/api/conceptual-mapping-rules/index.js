import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";

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

    async checkTermsValidity(content){
        let endpoint = this.paths['check_content_terms_validity'];
        return appApi.post(endpoint, {"content": content});
    }

    async cloneItem(id){
        let endpoint = this.paths['clone'].replace(':id', id);
        return appApi.post(endpoint);
    }

}

export const conceptualMappingRulesApi = new ConceptualMappingRulesApi();
