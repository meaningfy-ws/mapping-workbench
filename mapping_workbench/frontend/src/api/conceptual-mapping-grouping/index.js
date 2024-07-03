import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

class ConceptualMappingGroupingApi extends SectionApi {
    get SECTION_TITLE() {
        return "Fields Registry";
    }

    get SECTION_TREE_TITLE() {
        return "Conceptual Mappings Grouping Tree"
    }

    get SECTION_ITEM_TITLE() {
        return "Fields Registry";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW];
    }

    constructor() {
        super("conceptual_mapping_grouping");
        // this.isProjectResource = true;
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
        return {
            root: {
                "id":1,
            "cm_group_id": "string",
            "children": [{
                    "id":2,
              "cm_group_id": "string",
              "children": [{"id":3,"cm_group_id":"string"}]
            }]
            }
            }
        return await appApi.get(this.paths['elements_tree'], filters);
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

export const conceptualMappingGroupingApi = new ConceptualMappingGroupingApi();
