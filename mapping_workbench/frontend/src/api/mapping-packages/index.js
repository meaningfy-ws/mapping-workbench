import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {shaclTestSuitesApi} from "../shacl-test-suites";
import {sparqlTestSuitesApi} from "../sparql-test-suites";
import {resourceCollectionsApi} from "../resource-collections";

export const PACKAGE_TYPE = {
    EFORMS: 'eForms', STANDARD: 'Standard'
};

export const DEFAULT_PACKAGE_TYPE = "EFORMS";

class MappingPackagesApi extends SectionApi {
    get SECTION_TITLE() {
        return "Mapping Packages";
    }

    get SECTION_ITEM_TITLE() {
        return "Mapping Package";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW, ACTION.EDIT];
    }

    constructor() {
        super("mapping_packages");
        this.isProjectResource = true;
    }

    async getProjectPackages(full = false, request = {}) {
        request.page = 0;
        request.rowsPerPage = -1;
        let mappingPackagesStore = await this.getItems(request);
        return mappingPackagesStore.items && mappingPackagesStore.items.map(mappingPackage => {
            let data = {
                id: mappingPackage._id, title: mappingPackage.title, identifier: mappingPackage.identifier
            }
            if (full) {
                data[shaclTestSuitesApi.MAPPING_PACKAGE_LINK_FIELD] = mappingPackage[shaclTestSuitesApi.MAPPING_PACKAGE_LINK_FIELD];
                data[sparqlTestSuitesApi.MAPPING_PACKAGE_LINK_FIELD] = mappingPackage[sparqlTestSuitesApi.MAPPING_PACKAGE_LINK_FIELD];
                data[resourceCollectionsApi.MAPPING_PACKAGE_LINK_FIELD] = mappingPackage[resourceCollectionsApi.MAPPING_PACKAGE_LINK_FIELD];
            }
            return data;
        }).sort((a, b) => a.title.localeCompare(b.title)) || [];
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

    async createDefault(projectId) {
        try {
            let endpoint = this.paths['create_default'];
            return appApi.post(endpoint, {}, {project_id: projectId});
        } catch (err) {
        }
    }

    exportPackage(params) {
        let endpoint = this.paths['export'];
        const headers = {};
        params['t'] = Date.now();
        return appApi.get(endpoint, params, headers, {
            responseType: 'blob'
        });

    }

    getLatestState(package_id) {
        try {
            const endpoint = this.paths['latest_state'];
            return appApi.get(endpoint(package_id));
        } catch (err) {

        }
    }

    async deleteMappingPackageWithCleanup(id, cleanup_project = false) {
        let endpoint = this.paths['item'].replace(':id', id);
        return await appApi.delete(endpoint, {cleanup_project: cleanup_project});
    }
}

export const mappingPackagesApi = new MappingPackagesApi();
