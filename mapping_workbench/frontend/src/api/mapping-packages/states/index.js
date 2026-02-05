import {ACTION, SectionApi} from "src/api/section";
import {appApi} from "src/api/app";
import {sessionApi} from "../../session";

export const COMMENT_PRIORITY = {
    HIGH: 'high',
    NORMAL: 'normal',
    LOW: 'low'
};

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

    async getReports(sid) {
        const endpoint = this.paths['reports']
        const data = await appApi.get(endpoint(sid));
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

    async getShaclReportsFile(sid, suiteId, testId) {
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

    async getComments(sid, vid) {
        let endpoint = this.paths["validation_comments"]
            .replace(':sid', sid)
            .replace(':vid', vid);
        let params = {'project_id': sessionApi.getSessionProject()}
        return appApi.get(endpoint, params);
    }

    async getExistingValidationComments(sid, vids) {
        let endpoint = this.paths["existing_validation_comments"]
            .replace(':sid', sid);
        let data = {}
        data['validation_element_ids'] = vids
        let params = {'project_id': sessionApi.getSessionProject()}
        return appApi.post(endpoint, data, params);
    }

    async addComment(sid, vid, comment, priority, use_in_state, validation_context) {
        let endpoint = this.paths["validation_comments"]
            .replace(':sid', sid)
            .replace(':vid', vid);
        let data = {}
        data['comment'] = comment
        data['priority'] = priority
        data['use_in_state'] = use_in_state
        data['context'] = validation_context
        return appApi.post(endpoint, data, {'project_id': sessionApi.getSessionProject()});
    }

    async deleteComment(id) {
        let endpoint = this.paths.validation_comment(id);
        return appApi.delete(endpoint);
    }
}

export const mappingPackageStatesApi = new MappingPackageStatesApi();
