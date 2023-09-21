import {SectionApi} from "../section";
import {appApi} from "../app";

class ConceptualMappingRulesApi extends SectionApi {
    get SECTION_TITLE() {
        return "Conceptual Mapping Rules";
    }

    get SECTION_ITEM_TITLE() {
        return "Conceptual Mapping Rule";
    }

    constructor() {
        super("conceptual_mapping_rules");
        this.isProjectResource = true;
    }

    async checkTermsValidity(content){
        let endpoint = this.paths['check_content_terms_validity'];
        return appApi.post(endpoint, {"content": content});
    }
}

export const conceptualMappingRulesApi = new ConceptualMappingRulesApi();
