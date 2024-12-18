import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";

class FieldsOverview  extends SectionApi {
    get SECTION_TITLE() {
        return "Fields Overview";
    }

    get SECTION_ITEM_TITLE() {
        return "Field Overview";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW, ACTION.EDIT, ACTION.DELETE];
    }

    constructor() {
        super("fields_overview");
        this.isProjectResource = true;
    }

    importEFormsFromGithub(request) {
        try {
            const endpoint = this.paths['import_eforms_xsd'];
            const headers = {"Content-Type": "multipart/form-data"};
            return appApi.post(endpoint, request, null, headers);
        } catch (err) {
        }
    }

    async createItem(request) {
        return await super.createItem(request, "create");
    }
}

export const fieldsOverviewApi = new FieldsOverview();
