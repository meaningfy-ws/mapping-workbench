import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

class FlureeApi extends SectionApi {
    get SECTION_TITLE() {
        return "Fluree";
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


    async getItemsTree() {
        let filters = {}
        if (this.isProjectResource) {
            filters['project'] = sessionApi.getSessionProject();
        }
        return await appApi.get(this.paths['elements_tree'], filters);
    }
}

export const flureeApi = new FlureeApi();
