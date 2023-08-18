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

    async getProjectTripleMapFragments(request = {}) {
        let tripleMapFragmentsStore = await this.getItems();
        return tripleMapFragmentsStore.items.map(
            tripleMapFragment => ({id: tripleMapFragment._id, uri: tripleMapFragment.triple_map_uri})
        ).sort((a, b) => a.uri.localeCompare(b.uri));
    }
}

export const genericTripleMapFragmentsApi = new GenericTripleMapFragmentsApi();
