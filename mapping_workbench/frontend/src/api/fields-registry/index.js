import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

class FieldsRegistryApi extends SectionApi {
    get SECTION_TITLE() {
        return "Fields Registry";
    }

    get SECTION_TREE_TITLE() {
        return "Elements Tree"
    }

    get SECTION_ITEM_TITLE() {
        return "Fields Registry";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW];
    }

    constructor() {
        super("fields_registry");
        this.isProjectResource = true;
    }

    importEFormsFromGithub(request) {
        try {
            let endpoint = this.paths['import_eforms_from_github'];
            const headers = {"Content-Type": "multipart/form-data"};
            return appApi.post(endpoint, request, null, headers);
        } catch (err) {
        }
    }

    async getItemsTree() {
        let filters = {}
        if (this.isProjectResource) {
            filters['project'] = sessionApi.getSessionProject();
        }
        return await appApi.get(this.paths['elements_tree'], filters);
    }

    async getStructuralElementsForSelector(request = {}) {
        request.page = 0;
        request.rowsPerPage = -1;
        let structuralElementsStore = await this.getItems(request, 'elements');
        return structuralElementsStore.items.map(
            structuralElement => ({id: structuralElement._id, label: structuralElement.sdk_element_id})
        ).sort((a, b) => a.label.localeCompare(b.label));
    }

    async getXpathsList(request = {}) {
        request.page = 0;
        request.rowsPerPage = -1;
        const result = await this.getItems(request, 'elements');
        return result.items.map(e => ({
            id: e._id,
            absolute_xpath: e.absolute_xpath,
            element_type: e.element_type,
            parent_node_id: e.parent_node_id,
            relative_xpath: e.relative_xpath,
        }))
    }


    async addElement(data) {
        let endpoint = this.paths.elements;
        return appApi.post(endpoint, data, {'project_id': sessionApi.getSessionProject()});
    }
}

export const fieldsRegistryApi = new FieldsRegistryApi();
