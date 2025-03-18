import {TripleMapFragmentsApi} from "./index";
import {ACTION} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

class GenericTripleMapFragmentsApi extends TripleMapFragmentsApi {
    get SECTION_TITLE() {
        return "Triple Map Fragments";
    }

    get FILE_UPLOAD_FORMATS() {
        return {'TTL': {['text/ttl']: ['.ttl']},
                'YAML': {['text/yaml']: ['.yaml']}
        }
    }

    get SECTION_ITEM_TITLE() {
        return "Triple Map Fragment";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.EDIT, ACTION.DELETE]
    }

    constructor() {
        super("generic_triple_map_fragments");
    }

    async update_mapping_package(mapping_package_id, triple_map_fragments) {
        let endpoint = this.paths['items'] + '/update_mapping_package';
        let request = {
            mapping_package_id: mapping_package_id,
            triple_map_fragments: triple_map_fragments
        }
        return await appApi.update(endpoint, request);
    }

    async getTransformHistory(id) {
        const filters = {};
        filters['project'] = sessionApi.getSessionProject();
        const endpoint = this.paths['transform_history'].replace(':id', id);
        const data = await appApi.get(endpoint, filters);
        return Promise.resolve(data);
    }
}

export const genericTripleMapFragmentsApi = new GenericTripleMapFragmentsApi();
