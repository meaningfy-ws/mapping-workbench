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

    async deleteItem(sid) {
        const endpoint = this.paths['state'].replace(':id', sid);
        const data = await appApi.delete(endpoint);
        return Promise.resolve(data);
    }

    async getState(sid) {
        const endpoint = this.paths['state'].replace(':id', sid);
        const data = await appApi.get(endpoint);
        return Promise.resolve(data);
    }

    async getValidationReports(params) {
        const endpoint = this.paths['validation_reports']
        const data = await appApi.get(endpoint, params);
        return Promise.resolve(data);
    }

    async getXpathReports(sid) {
        const endpoint = this.paths['xpath_reports']
        const data = await appApi.get(endpoint(sid));
        return Promise.resolve(data);
    }

    async getXpathReportsSuite(sid, suiteId) {
        const endpoint = this.paths['xpath_reports_suite']
        const data = await appApi.get(endpoint(sid, suiteId));
        return Promise.resolve(data);
    }

    async getXpathReportsTest(sid, suiteId, testId) {
        const endpoint = this.paths['xpath_reports_test']
        const data = await appApi.get(endpoint(sid, suiteId, testId));
        return Promise.resolve(data);
    }


    async getValidationReportTree(sid) {
        const endpoint = this.paths['validation_reports_tree']
        const data = await appApi.get(endpoint(sid))
        return Promise.resolve(data);
    }

    async getSparqlReports(sid) {
        const endpoint = this.paths['sparql_reports']
        const data = await appApi.get(endpoint(sid));
        return Promise.resolve(data);
    }


    async getSparqlReportsSuite(sid, suiteId) {
        const endpoint = this.paths['sparql_reports_suite']
        const data = await appApi.get(endpoint(sid, suiteId));
        return Promise.resolve(data);
    }

    async getSparqlReportsTest(sid, suiteId, testId) {
        const endpoint = this.paths['sparql_reports_test']
        const data = await appApi.get(endpoint(sid, suiteId, testId));
        return Promise.resolve(data);
    }

    async getShaclReports(sid) {
        const endpoint = this.paths['shacl_reports']
        const data = await appApi.get(endpoint(sid));
        return Promise.resolve(data);
    }

    async getShaclReportsSuite(sid, suiteId) {
        const endpoint = this.paths['shacl_reports_suite']
        const data = await appApi.get(endpoint(sid, suiteId));
        return Promise.resolve(data);
    }

    async getSparqlReportsFile(sid, suiteId, testId) {
        const endpoint = this.paths['shacl_reports_test']
        const data = await appApi.get(endpoint(sid, suiteId, testId));
        return Promise.resolve(data);
    }

    async getValidationReportFiles(params) {
        const endpoint = this.paths['validation_report_files']
        const data = await appApi.get(endpoint, params);
        return Promise.resolve(data);
    }

    exportPackage(params) {
        const endpoint = this.paths['export_specific'];
        const headers = {};
        params['t'] = Date.now();
         return appApi.get(endpoint, params, headers, {
            responseType: 'blob'
        });
    }
}

export const mappingPackageStatesApi = new MappingPackageStatesApi();
