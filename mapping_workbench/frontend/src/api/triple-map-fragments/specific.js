import {TripleMapFragmentsApi} from "./index";
import {appApi} from "../app";
import {ACTION} from "../section";

class SpecificTripleMapFragmentsApi extends TripleMapFragmentsApi {
    get SECTION_TITLE() {
        return "Triple Map Fragments";
    }

    get SECTION_ITEM_TITLE() {
        return "Triple Map Fragment";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.EDIT, ACTION.DELETE]
    }

    constructor() {
        super("specific_triple_map_fragments");
        this.hasMappingPackage = true;
        this.isMappingPackageRequired = this.hasMappingPackage && true;
    }

    async update_mapping_package(mapping_package_id, triple_map_fragments) {
        let endpoint = this.paths['items'] + '/update_specific_mapping_package';
        let request = {
            mapping_package_id: mapping_package_id,
            triple_map_fragments: triple_map_fragments
        }
        return await appApi.update(endpoint, request);
    }
}

export const specificTripleMapFragmentsApi = new SpecificTripleMapFragmentsApi();
