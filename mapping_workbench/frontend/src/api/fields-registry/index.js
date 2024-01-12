import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";

class FieldsRegistryApi extends SectionApi {
    get SECTION_TITLE() {
        return "Fields Registry";
    }

    get SECTION_ITEM_TITLE() {
        return "Fields Registry";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW];
    }

    constructor() {
        super("fields_registry");
    }

    importEFormsFromGithub(request) {
        try {
            let endpoint = this.paths['import_eforms_from_github'];
            const headers = {"Content-Type": "multipart/form-data"};
            return appApi.post(endpoint, request, null, headers);
        } catch (err) {
        }
    }
}

export const fieldsRegistryApi = new FieldsRegistryApi();
