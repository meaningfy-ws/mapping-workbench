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
        const reportType = 'state';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const state = await this.getValidationReportFromCache(key);
            if (state) {
                return state;
            }
        }

        const endpoint = this.paths['state'].replace(':id', sid);
        const data = await appApi.get(endpoint);
        await this.setValidationReportInCache(sid, data, reportType);
        return Promise.resolve(data);
    }

    async getValidationReports(params) {
        const endpoint = this.paths['validation_reports']
        const data = await appApi.get(endpoint, params);
        return Promise.resolve(data);
    }

    async getXpathReports(sid) {
        const reportType = 'validation.xpath';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }
        const endpoint = this.paths['xpath_reports']
        const data = await appApi.get(endpoint(sid));
        await this.setValidationReportInCache(sid, data, reportType);
        return Promise.resolve(data);
    }

    async getXpathReportsSuite(sid, suiteId) {
        const reportType = 'test_data_suites.' + suiteId + '.validation.xpath';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }

        const endpoint = this.paths['xpath_reports_suite']
        const data = await appApi.get(endpoint(sid, suiteId));
        await this.setValidationReportInCache(sid, data, reportType);
        return Promise.resolve(data);
    }

    async getXpathReportsTest(sid, suiteId, testId) {
        const reportType = 'test_data_suites.' + suiteId + '.test_data_states.' + testId + '.validation.xpath';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }

        const endpoint = this.paths['xpath_reports_test']
        const data = await appApi.get(endpoint(sid, suiteId, testId));
        await this.setValidationReportInCache(sid, data, reportType);
        return Promise.resolve(data);
    }

    async getValidationReportTree(sid) {
        const reportType = 'validation.validation_reports_tree';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }
        const endpoint = this.paths['validation_reports_tree']
        const data = await appApi.get(endpoint(sid))
        await this.setValidationReportInCache(sid, data, reportType);
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
        const reportType = 'validation.sparql';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }
        const endpoint = this.paths['sparql_reports']
        const data = await appApi.get(endpoint(sid));
        await this.setValidationReportInCache(sid, data, reportType);
        return Promise.resolve(data);
    }


    async getSparqlReportsSuite(sid, suiteId) {
        const reportType = 'test_data_suites.' + suiteId + '.validation.sparql';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }

        const endpoint = this.paths['sparql_reports_suite']
        const data = await appApi.get(endpoint(sid, suiteId));
        await this.setValidationReportInCache(sid, data, reportType);
        return Promise.resolve(data);
    }

    async getSparqlReportsTest(sid, suiteId, testId) {
        const reportType = 'test_data_suites.' + suiteId + '.test_data_states.' + testId + '.validation.sparql';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }

        const endpoint = this.paths['sparql_reports_test']
        const data = await appApi.get(endpoint(sid, suiteId, testId));
        await this.setValidationReportInCache(sid, data, reportType);
        return Promise.resolve(data);
    }

    async getShaclReports(sid) {
        const reportType = 'validation.shacl';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }
        const endpoint = this.paths['shacl_reports']
        const data = await appApi.get(endpoint(sid));
        await this.setValidationReportInCache(sid, data, reportType);
        return Promise.resolve(data);
    }

    async getShaclReportsSuite(sid, suiteId) {
        const reportType = 'test_data_suites.' + suiteId + '.validation.shacl';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }

        const endpoint = this.paths['shacl_reports_suite']
        const data = await appApi.get(endpoint(sid, suiteId));
        await this.setValidationReportInCache(sid, data, reportType);
        return Promise.resolve(data);
    }

    async getShaclReportsFile(sid, suiteId, testId) {
        const reportType = 'test_data_suites.' + suiteId + '.test_data_states.' + testId + '.validation.shacl';
        const key = sid + '.' + reportType;
        if (await this.hasValidationReportInCache(key)) {
            const reports = await this.getValidationReportFromCache(key);
            if (reports) {
                return reports;
            }
        }
        const endpoint = this.paths['shacl_reports_test']
        const data = await appApi.get(endpoint(sid, suiteId, testId));
        await this.setValidationReportInCache(sid, data, reportType);
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

    async setValidationReportInCache(stateId, value, reportType = '') {
        // Store as string for safety
        let cacheKey = stateId + (reportType ? '.' + reportType : '')
        await this.setInCache(cacheKey, value, DB_STORE.VALIDATION_REPORTS,
            'Not enough storage space available for this report. Remove older States.'
        )
    }

    async getFromCache(key, storeName) {
        const db = await this._getDb();
        return await db.get(storeName, key);
    }

    async getValidationReportFromCache(key) {
        return await this.getFromCache(key, DB_STORE.VALIDATION_REPORTS);
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
