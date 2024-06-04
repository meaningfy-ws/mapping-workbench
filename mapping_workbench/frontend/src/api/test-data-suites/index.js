import {FileCollectionsApi} from "../file-collections";
import {sessionApi} from "../session";
import {appApi} from "../app";
import {ACTION} from "../section";

class TestDataSuitesApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "Test Data Suites";
    }

    get SECTION_ITEM_TITLE() {
        return "Test Data Suite";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW, ACTION.DELETE]
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return 'ZIP'
    }

    get FILE_RESOURCE_FORMATS() {
        return {'ZIP':'ZIP'}
    }

    get FILE_UPLOAD_FORMATS() {
        return {'ZIP': 'application/zip'}
    }

    constructor() {
        super("test_data_suites");
        this.isProjectResource = true;
    }

    async getValuesForSelector(request = {}) {
        let valuesStore = await this.getItems();
        return valuesStore.items.map(
            value => ({id: value._id, title: value.title})
        ).sort((a, b) => a.title.localeCompare(b.title));
    }

    async transformTestData(request = {}) {
        try {
            let endpoint = this.paths['tasks']['transform_test_data'];
            let filters = {}
            if (request['filters']) {
                filters = request['filters'];
            }
            filters['project'] = sessionApi.getSessionProject();
            return appApi.post(endpoint, filters);
        } catch (err) {
        }
    }
}

export const testDataSuitesApi = new TestDataSuitesApi();
