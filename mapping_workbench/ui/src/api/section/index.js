import {appApi} from "../app";
import {apiPaths} from "../../paths";

export const ACTION = {
    LIST: 'list',
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete'
};

export class SectionApi {
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

    async getItems(request = {}) {
        const {filters, page, rowsPerPage} = request;
        return await appApi.get(this.paths['items']);
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
}
