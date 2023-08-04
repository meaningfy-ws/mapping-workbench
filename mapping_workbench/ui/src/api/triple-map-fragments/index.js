import {SectionApi} from "../section";

class TripleMapFragmentsApi extends SectionApi {
    get SECTION_TITLE() {
        return "Triple Map Fragments";
    }

    get SECTION_ITEM_TITLE() {
        return "Triple Map Fragment";
    }

    constructor() {
        super("triple_map_fragments");
    }
}

export const tripleMapFragmentsApi = new TripleMapFragmentsApi();
