import {SectionApi} from "../section";

class SpecificTripleMapFragmentsApi extends SectionApi {
    get SECTION_TITLE() {
        return "Specific Triple Map Fragments";
    }

    get SECTION_ITEM_TITLE() {
        return "Specific Triple Map Fragment";
    }

    constructor() {
        super("specific_triple_map_fragments");
        this.isProjectResource = true;
    }
}

export const specificTripleMapFragmentsApi = new SpecificTripleMapFragmentsApi();
