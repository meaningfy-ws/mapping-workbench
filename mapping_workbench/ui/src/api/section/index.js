import {appApi} from "../app";
import {apiPaths} from "../../paths";
import {sessionApi} from "../session";

export const ACTION = {
    LIST: 'list',
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete'
};

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

    async getItems(request = {}, path = 'items') {
        const {filters = {}, page, rowsPerPage} = request;
        if (this.isProjectResource) {
            filters['project'] = sessionApi.getSessionProject();
        }
        return await appApi.get(this.paths[path], filters);
    }

    async getItem(id) {
        let endpoint = this.paths['item'].replace(':id', id);
        return await appApi.get(endpoint);
    }

    async deleteItem(id) {
        let endpoint = this.paths['item'].replace(':id', id);
        return await appApi.delete(endpoint);
    }

    async updateItem(request) {
        const {id} = request;
        let endpoint = this.paths['item'].replace(':id', id);
        delete request['id'];
        return await appApi.update(endpoint, request);
    }

    async createItem(request) {
        let endpoint = this.paths['items'];
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
