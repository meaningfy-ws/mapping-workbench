import {SectionApi} from "../section";
import {appApi} from "../app";

class MappingPackagesApi extends SectionApi {
    get SECTION_TITLE() {
        return "Mapping Packages";
    }

    get SECTION_ITEM_TITLE() {
        return "Mapping Package";
    }

    constructor() {
        super("mapping_packages");
        this.isProjectResource = true;
    }

    async getProjectPackages(request = {}) {
        request.page = 0;
        request.rowsPerPage = -1;
        let mappingPackagesStore = await this.getItems(request);
        return mappingPackagesStore.items && mappingPackagesStore.items.map(
            mappingPackage => ({
                id: mappingPackage._id,
                title: mappingPackage.title,
                identifier: mappingPackage.identifier
            })
        ).sort((a, b) => a.title.localeCompare(b.title)) || [];
    }

    importPackage(request) {
        try {
            let endpoint = this.paths['import'];
            const headers = {"Content-Type": "multipart/form-data"};
            return appApi.post(endpoint, request, null, headers);
        } catch (err) {
        }
    }

    processPackage(request) {
        try {
            let endpoint = this.paths['process'];
            const headers = {"Content-Type": "multipart/form-data"};
            return appApi.post(endpoint, request, null, headers);
        } catch (err) {
        }
    }

    exportPackage(params) {
        try {
            let endpoint = this.paths['export'];
            const headers = {};
            params['t'] = Date.now();
             return appApi.get(endpoint, params, headers, {
                responseType: 'blob'
            });
        } catch (err) {
        }
    }

    getLatestState(package_id) {
        try {
            const endpoint = this.paths['latest_state'];
            return appApi.get(endpoint(package_id));
        } catch (err) {

        }
    }
}

export const mappingPackagesApi = new MappingPackagesApi();
