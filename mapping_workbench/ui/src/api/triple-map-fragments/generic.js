import {SectionApi} from "../section";

class GenericTripleMapFragmentsApi extends SectionApi {
    get SECTION_TITLE() {
        return "Generic Triple Map Fragments";
    }

    get SECTION_ITEM_TITLE() {
        return "Generic Triple Map Fragment";
    }

    constructor() {
        super("generic_triple_map_fragments");
        this.isProjectResource = true;
    }
}

export const genericTripleMapFragmentsApi = new GenericTripleMapFragmentsApi();
