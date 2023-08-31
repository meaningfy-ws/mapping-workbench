import {SectionApi} from "../section";

export class TripleMapFragmentsApi extends SectionApi {
    get SECTION_TITLE() {
        return "Triple Map Fragments";
    }

    get SECTION_ITEM_TITLE() {
        return "Triple Map Fragment";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "TTL": "TTL",
            "YAML": "YAML"
        };
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return "TTL";
    }

    get FILE_RESOURCE_CODE() {
        return {
            "TTL": {
                "grammar": "turtle",
                "language": "turtle"
            },
            "YAML": {
                "grammar": "yaml",
                "language": "yaml"
            }
        };
    }

    constructor(section = "triple_map_fragments") {
        super(section);
        this.isProjectResource = true;
    }

    async getValuesForSelector(request = {}) {
        let tripleMapFragmentsStore = await this.getItems(request);
        return tripleMapFragmentsStore.items.map(
            tripleMapFragment => ({id: tripleMapFragment._id, uri: tripleMapFragment.triple_map_uri})
        ).sort((a, b) => a.uri.localeCompare(b.uri));
    }
}

export const tripleMapFragmentsApi = new TripleMapFragmentsApi();