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

    async getStructuralElementsForSelector(request = {}) {
        request.page = 0;
        request.rowsPerPage = -1;
        let structuralElementsStore = await this.getItems(request, 'elements');
        return structuralElementsStore.items.map(
            structuralElement => ({id: structuralElement._id, eforms_sdk_element_id: structuralElement.eforms_sdk_element_id})
        ).sort((a, b) => a.eforms_sdk_element_id.localeCompare(b.eforms_sdk_element_id));
    }
}

export const fieldsRegistryApi = new FieldsRegistryApi();
