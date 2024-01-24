import {ACTION, SectionApi} from "src/api/section";
import {appApi} from "src/api/app";

export class MappingPackageStatesApi extends SectionApi {

    get SECTION_TITLE() {
        return "Mapping Package States";
    }

    get SECTION_ITEM_TITLE() {
        return "Mapping Package State";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW, ACTION.DELETE];
    }

    constructor() {
        super("mapping_packages");
    }

    async getStates(id, request = {}) {
        const endpoint = this.paths['states'].replace(':id', id);
        const data = await this.getItems(request, null, endpoint);
        return Promise.resolve(data);
    }

    async deleteState(sid) {
        const endpoint = this.paths['state'].replace(':id', sid);
        const data = await appApi.delete(endpoint);
        return Promise.resolve(data);
    }

    async getState(sid) {
        const endpoint = this.paths['state'].replace(':id', sid);
        const data = await appApi.get(endpoint);
        return Promise.resolve(data);
    }

    exportPackage(params) {
        console.log('here exportPackage',params)
        try {
            const endpoint = this.paths['export_specific'];
            const headers = {};
            params['t'] = Date.now();
             return appApi.get(endpoint, params, headers, {
                responseType: 'blob'
            });
        } catch (err) {
        }
    }
}

export const mappingPackageStatesApi = new MappingPackageStatesApi();
