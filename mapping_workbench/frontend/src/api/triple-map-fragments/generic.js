import {TripleMapFragmentsApi} from "./index";

class GenericTripleMapFragmentsApi extends TripleMapFragmentsApi {
    get SECTION_TITLE() {
        return "Generic Triple Map Fragments";
    }

    get SECTION_ITEM_TITLE() {
        return "Generic Triple Map Fragment";
    }

    constructor() {
        super("generic_triple_map_fragments");
    }
}

export const genericTripleMapFragmentsApi = new GenericTripleMapFragmentsApi();
