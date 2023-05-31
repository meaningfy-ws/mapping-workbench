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
        const { filters, page, rowsPerPage } = request;

        let {items, count} = await appApi.get(this.paths['items']);

        return Promise.resolve({
            items,
            count
        });
    }

    async getItem(id) {
        let endpoint = this.paths['item'].replace(':id', id);
        let data = await appApi.get(endpoint);
        return Promise.resolve(data);
    }

    async deleteItem(id) {
        let endpoint = this.paths['item'].replace(':id', id);
        let data = await appApi.delete(endpoint);
        return Promise.resolve(data);
    }

    async updateItem(request) {
        const { id } = request;
        let endpoint = this.paths['item'].replace(':id', id);
        delete request['id'];
        let data = await appApi.update(endpoint, request);
        return Promise.resolve(data);
    }

    async createItem(request) {
        try {
            let endpoint = this.paths['items'];
            let data = await appApi.create(endpoint, request);
            return Promise.resolve(data);
        } catch (err) {
            console.log("K :: ", err);
        }
    }
}
