import {ACTION, SectionApi} from "src/api/section";
import {appApi} from "src/api/app";
import {sessionApi} from "../../session";
import {openDB} from 'idb';
import {toastLoad, toastSuccess, toastWarning} from "../../../components/app-toast";

export const COMMENT_PRIORITY = {
    HIGH: 'high',
    NORMAL: 'normal',
    LOW: 'low'
};


const DB_STORE = {
    VALIDATION_REPORTS: 'validation_reports'
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
        this._dbPromise = null; // Lazy init
    }

    async _getDb() {
        if (typeof window === 'undefined' || !('indexedDB' in window)) {
            throw new Error('IndexedDB is not available in this environment.');
        }
        if (!this._dbPromise) {
            this._dbPromise = openDB('mapping-workbench-cache', 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(DB_STORE.VALIDATION_REPORTS)) {
                        db.createObjectStore(DB_STORE.VALIDATION_REPORTS);
                    }
                }
            });
        }
        return this._dbPromise;
    }

    async getStates(id, request = {}) {
        const endpoint = this.paths['states'].replace(':id', id);
        const data = await this.getItems(request, null, endpoint);
        return Promise.resolve(data);
    }

    async deleteItem(sid) {
        const endpoint = this.paths['state'].replace(':id', sid);
        const data = await appApi.delete(endpoint);
        await this.deleteStateFromCache(sid);
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

    async getValidationReportTestDataSuiteFromCache(sid, id) {
        if (await this.hasValidationReportInCache(sid)) {
            const state = await this.getValidationReportFromCache(sid);
            if (state && Object.hasOwn(state, 'test_data_suites')) {
                const testDataSuite = state.test_data_suites.find(
                    suite => suite.oid === id
                ) || false;
                if (testDataSuite) {
                    return testDataSuite;
                }
            }
        }
        return null;
    }

    async getValidationReportTestDataSuiteDataFromCache(sid, id) {
        const testDataSuite = await this.getValidationReportTestDataSuiteFromCache(sid, id);
        if (testDataSuite && Object.hasOwn(testDataSuite, 'validation')) {
            return testDataSuite.validation;
        }
        return null;
    }

    async getValidationReportTestDataFromCache(sid, suiteId, id) {
        const testDataSuite = await this.getValidationReportTestDataSuiteFromCache(sid, suiteId);
        if (testDataSuite && Object.hasOwn(testDataSuite, 'test_data_states')) {
            const testData = testDataSuite.test_data_states.find(
                data => data.oid === id
            ) || false;
            if (testData) {
                return testData;
            }
        }
        return null;
    }

    async getValidationReportTestDataDataFromCache(sid, suiteId, id) {
        const testData = await this.getValidationReportTestDataFromCache(sid, suiteId, id);
        if (testData && Object.hasOwn(testData, 'validation')) {
            return testData.validation;
        }
        return null;
    }

    async getXpathReports(sid) {
        if (await this.hasValidationReportInCache(sid)) {
            const reports = await this.getValidationReportDataFromCache(sid);
            if (reports && Object.hasOwn(reports, 'xpath')) {
                return reports.xpath;
            }
        }
        const endpoint = this.paths['xpath_reports']
        const data = await appApi.get(endpoint(sid));
        return Promise.resolve(data);
    }

    async getXpathReportsSuite(sid, suiteId) {
        const suiteValidationReport = await this.getValidationReportTestDataSuiteDataFromCache(sid, suiteId);

        if (suiteValidationReport && Object.hasOwn(suiteValidationReport, 'xpath')) {
            return suiteValidationReport.xpath;
        }
        const endpoint = this.paths['xpath_reports_suite']
        const data = await appApi.get(endpoint(sid, suiteId));
        return Promise.resolve(data);
    }

    async getXpathReportsTest(sid, suiteId, testId) {
        const testValidationReport = await this.getValidationReportTestDataDataFromCache(sid, suiteId, testId);
        if (testValidationReport && Object.hasOwn(testValidationReport, 'xpath')) {
            return testValidationReport.xpath;
        }
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
        if (await this.hasValidationReportInCache(sid)) {
            const report = await this.getValidationReportFromCache(sid);
            if (report && Object.hasOwn(report, 'validation')) {
                return report.validation;
            }
        }
        const endpoint = this.paths['reports']
        const validationData = await appApi.get(endpoint(sid));
        await this.setValidationReportInCache(sid, validationData);
        return validationData.validation;
    }

    async getSparqlReports(sid) {
        if (await this.hasValidationReportInCache(sid)) {
            const reports = await this.getValidationReportDataFromCache(sid);
            if (reports && Object.hasOwn(reports, 'sparql')) {
                return reports.sparql;
            }
        }
        const endpoint = this.paths['sparql_reports']
        const data = await appApi.get(endpoint(sid));
        return Promise.resolve(data);
    }


    async getSparqlReportsSuite(sid, suiteId) {
        const suiteValidationReport = await this.getValidationReportTestDataSuiteDataFromCache(sid, suiteId);
        if (suiteValidationReport && Object.hasOwn(suiteValidationReport, 'sparql')) {
            return suiteValidationReport.sparql;
        }
        const endpoint = this.paths['sparql_reports_suite']
        const data = await appApi.get(endpoint(sid, suiteId));
        return Promise.resolve(data);
    }

    async getSparqlReportsTest(sid, suiteId, testId) {
        const testValidationReport = await this.getValidationReportTestDataDataFromCache(sid, suiteId, testId);
        if (testValidationReport && Object.hasOwn(testValidationReport, 'sparql')) {
            return testValidationReport.sparql;
        }
        const endpoint = this.paths['sparql_reports_test']
        const data = await appApi.get(endpoint(sid, suiteId, testId));
        return Promise.resolve(data);
    }

    async getShaclReports(sid) {
        if (await this.hasValidationReportInCache(sid)) {
            const reports = await this.getValidationReportDataFromCache(sid);
            if (reports && Object.hasOwn(reports, 'shacl')) {
                return reports.shacl;
            }
        }
        const endpoint = this.paths['shacl_reports']
        const data = await appApi.get(endpoint(sid));
        return Promise.resolve(data);
    }

    async getShaclReportsSuite(sid, suiteId) {
        const suiteValidationReport = await this.getValidationReportTestDataSuiteDataFromCache(sid, suiteId);
        if (suiteValidationReport && Object.hasOwn(suiteValidationReport, 'shacl')) {
            return suiteValidationReport.shacl;
        }
        const endpoint = this.paths['shacl_reports_suite']
        const data = await appApi.get(endpoint(sid, suiteId));
        return Promise.resolve(data);
    }

    async getShaclReportsFile(sid, suiteId, testId) {
        const testValidationReport = await this.getValidationReportTestDataDataFromCache(sid, suiteId, testId);
        if (testValidationReport && Object.hasOwn(testValidationReport, 'shacl')) {
            return testValidationReport.shacl;
        }
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

    // IndexedDB cache helpers
    async deleteFromCache(key, value, storeName) {
        const db = await this._getDb();
        await db.delete(storeName, key);
    }

    async deleteValidationReportFromCache(stateId) {
        await this.deleteFromCache(DB_STORE.VALIDATION_REPORTS, stateId)
    }

    async setInCache(key, value, storeName, noSpaceMessage = null) {
        const toastId = toastLoad('Caching data...')
        try {
            const db = await this._getDb();
            await db.put(storeName, value, key);
            toastSuccess("Data cached.", toastId);
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                // Not enough space
                if (!noSpaceMessage) {
                    noSpaceMessage = 'Not enough storage space available for this data.';
                }
                toastWarning(noSpaceMessage, toastId);
            } else {
                // Other error
                console.error(e);
            }
            return false;
        }
    }

    async setValidationReportInCache(stateId, value) {
        // Store as string for safety
        await this.setInCache(stateId, value, DB_STORE.VALIDATION_REPORTS,
            'Not enough storage space available for this report. Remove older States.'
        )
    }

    async getFromCache(key, storeName) {
        const db = await this._getDb();
        return await db.get(storeName, key);
    }

    async getValidationReportFromCache(stateId) {
        return await this.getFromCache(stateId, DB_STORE.VALIDATION_REPORTS);
    }

    async getValidationReportDataFromCache(stateId) {
        const validationReport = await this.getValidationReportFromCache(stateId);
        if (validationReport && Object.hasOwn(validationReport, 'validation')) {
            return validationReport.validation;
        }
    }

    async hasInCache(key, storeName) {
        const db = await this._getDb();
        // Use .has if available, otherwise fallback to .get
        if (typeof db.has === 'function') {
            return await db.has(storeName, key);
        } else {
            const value = await this.getFromCache(key, storeName);
            return value !== undefined && value !== null;
        }
    }

    async hasValidationReportInCache(stateId) {
        return await this.hasInCache(stateId, DB_STORE.VALIDATION_REPORTS);
    }

    async clearStoreFromCache(storeName) {
        const db = await this._getDb();
        await db.clear(storeName);
    }

    async clearValidationReportsFromCache() {
        const toastId = toastLoad('Clearing Validation Reports cache...')
        await this.clearStoreFromCache(DB_STORE.VALIDATION_REPORTS)
        toastSuccess("Validation Reports cache cleared.", toastId);
    }
}

export const mappingPackageStatesApi = new MappingPackageStatesApi();
