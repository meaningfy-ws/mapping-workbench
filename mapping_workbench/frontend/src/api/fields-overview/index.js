import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";

class FieldsOverview  extends SectionApi {
    get SECTION_TITLE() {
        return "Fields Overview";
    }

    get SECTION_ITEM_TITLE() {
        return "Fields Overview";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW];
    }

    constructor() {
        super("fields_overview");
        this.isProjectResource = true;
    }

    importEFormsFromGithub(request) {
        try {
            const endpoint = this.paths['import_eforms_from_github'];
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
            structuralElement => ({id: structuralElement._id, sdk_element_id: structuralElement.sdk_element_id})
        ).sort((a, b) => a.sdk_element_id.localeCompare(b.sdk_element_id));
    }
}

export const fieldsOverviewApi = new FieldsOverview();
