import {SectionApi} from "../section";

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
}

export const conceptualMappingRulesApi = new ConceptualMappingRulesApi();
