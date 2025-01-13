import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {shaclTestSuitesApi} from "../shacl-test-suites";
import {sparqlTestSuitesApi} from "../sparql-test-suites";
import {resourceCollectionsApi} from "../resource-collections";
import {testDataSuitesApi} from "../test-data-suites";

export const PACKAGE_TYPE = {
    EFORMS: 'eForms', STANDARD: 'Standard'
};

export const PROCESS_STATUS = {
    PROCESSING: {title: 'Processing', color: "info"},
    PROCESSED_SUCCESS: {title: 'Processed (success)', color: "success"},
    PROCESSED_ERROR: {title: 'Processed (error)', color: "error"},
    UNPROCESSED: {title: 'Unprocessed', color: "warning"}
};

export const EFORMS_PACKAGE_TYPE = "EFORMS";
export const DEFAULT_PACKAGE_TYPE = EFORMS_PACKAGE_TYPE;

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
        const mappingPackagesStore = await this.getItems(request);
        return mappingPackagesStore.items?.map(mappingPackage => {
            let data = {
                id: mappingPackage._id, title: mappingPackage.title, identifier: mappingPackage.identifier
            }
            if (full) {
                data[testDataSuitesApi.MAPPING_PACKAGE_LINK_FIELD] = mappingPackage[testDataSuitesApi.MAPPING_PACKAGE_LINK_FIELD];
                data[shaclTestSuitesApi.MAPPING_PACKAGE_LINK_FIELD] = mappingPackage[shaclTestSuitesApi.MAPPING_PACKAGE_LINK_FIELD];
                data[sparqlTestSuitesApi.MAPPING_PACKAGE_LINK_FIELD] = mappingPackage[sparqlTestSuitesApi.MAPPING_PACKAGE_LINK_FIELD];
                data[resourceCollectionsApi.MAPPING_PACKAGE_LINK_FIELD] = mappingPackage[resourceCollectionsApi.MAPPING_PACKAGE_LINK_FIELD];
            }
            return data;
        }).sort((a, b) => a.title.localeCompare(b.title)) || [];
    }

    importPackage(request) {
        let endpoint = this.paths['import'];
        const headers = {"Content-Type": "multipart/form-data"};
        return appApi.post(endpoint, request, null, headers);
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
            return await appApi.post(endpoint, {}, {project_id: projectId});
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
