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
        let endpoint = this.paths['states'].replace(':id', id);
        let data = await this.getItems(request, null, endpoint);
        return Promise.resolve(data);
    }

    async deleteState(sid) {
        let endpoint = this.paths['state'].replace(':id', sid);
        let data = await appApi.delete(endpoint);
        return Promise.resolve(data);
    }

    async getState(sid) {
        let endpoint = this.paths['state'].replace(':id', sid);
        let data = await appApi.get(endpoint);
        return Promise.resolve(data);
    }
}

export const mappingPackageStatesApi = new MappingPackageStatesApi();
