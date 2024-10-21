import {appApi} from "../app";
import {apiPaths} from "../../paths";
import {sessionApi} from "../session";

export const ACTION = {
    LIST: 'list',
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete',
    VIEW: 'view'
};

const DEFAULT_PAGE = 0;
const DEFAULT_ROWS_PER_PAGE = 25;
const DEFAULT_ROWS_PER_PAGE_SELECTION = [5, 10, 25, 50, { value: -1, label: 'All' }];

export class SectionApi {
    isProjectResource;

    get sectionTitle() {
        return "Items";
    }

    get sectionItemTitle() {
        return "Item";
    }

    constructor(section) {
        this.section = section;
        this.paths = apiPaths[section];
    }

    get DEFAULT_PAGE() {
        return DEFAULT_PAGE;
    }

    get DEFAULT_ROWS_PER_PAGE() {
        return DEFAULT_ROWS_PER_PAGE;
    }

    get DEFAULT_ROWS_PER_PAGE_SELECTION() {
        return DEFAULT_ROWS_PER_PAGE_SELECTION;
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW, ACTION.EDIT, ACTION.DELETE];
    }

    async getItems(request = {}, path = null, endpoint = null) {
        if (!path) {
            path = 'items';
        }

        const {
            filters = {},
            page = this.DEFAULT_PAGE,
            rowsPerPage = -1,
            sortField,
            sortDirection
        } = request;
        if (this.isProjectResource) {
            filters['project'] = sessionApi.getSessionProject();
        }
        filters['page'] = page;
        filters['limit'] = rowsPerPage >= 0 ? rowsPerPage : null;
        if(sortField)
            filters['sort_field'] = sortField;
        if(sortDirection)
            filters['sort_direction'] = sortDirection;

        return await appApi.get(endpoint || this.paths[path], filters);
    }

    async getItem(id, path = null) {
        path = path || "item";
        let endpoint = this.paths[path].replace(':id', id);
        return await appApi.get(endpoint);
    }

    async deleteItem(id, path = null) {
        path = path || "item";
        let endpoint = this.paths[path].replace(':id', id);
        return await appApi.delete(endpoint);
    }

    async updateItem(request, path = null) {
        path = path || "item";
        const {id} = request;
        let endpoint = this.paths[path].replace(':id', id);
        delete request['id'];
        return await appApi.update(endpoint, request);
    }

    async createItem(request, path = null) {
        path = path || "items";
        let endpoint = this.paths[path];
        return await appApi.create(endpoint, request);
    }

    async update(forQuery = {}, setValues = {}) {
        let endpoint = this.paths['items'];
        let request = {
            for_query: forQuery,
            set_values: setValues
        }
        return await appApi.update(endpoint, request);
    }
}
