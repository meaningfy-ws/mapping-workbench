import {TripleMapFragmentsApi} from "./index";
import {ACTION} from "../section";

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
}

export const genericTripleMapFragmentsApi = new GenericTripleMapFragmentsApi();
