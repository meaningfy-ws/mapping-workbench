import {TripleMapFragmentsApi} from "./index";
import {appApi} from "../app";

class SpecificTripleMapFragmentsApi extends TripleMapFragmentsApi {
    get SECTION_TITLE() {
        return "Specific Triple Map Fragments";
    }

    get SECTION_ITEM_TITLE() {
        return "Specific Triple Map Fragment";
    }

    constructor() {
        super("specific_triple_map_fragments");
    }

    async update_specific_mapping_package(mapping_package, triple_map_fragments) {
        let endpoint = this.paths['items'] + '/update_specific_mapping_package';
        let request = {
            mapping_package: mapping_package,
            triple_map_fragments: triple_map_fragments
        }
        return await appApi.update(endpoint, request);
    }
}

export const specificTripleMapFragmentsApi = new SpecificTripleMapFragmentsApi();
