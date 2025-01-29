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
        return [ACTION.VIEW, ACTION.EDIT, ACTION.DELETE]
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return 'ZIP'
    }

    get FILE_RESOURCE_FORMATS() {
        return {'ZIP':'ZIP'}
    }

    get FILE_UPLOAD_FORMATS() {
          return {'application/zip': ['.zip']}
    }

    get MAPPING_PACKAGE_LINK_FIELD() {
        return "test_data_suites"
    }

    constructor() {
        super("test_data_suites");
        this.isProjectResource = true;
        this.refersToMappingPackages = true;
    }

    async getValuesForSelector(request = {}) {
        request.page = 0;
        request.rowsPerPage = -1;
        let valuesStore = await this.getItems(request);
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

    importFileCollections(request) {
        try {
            let endpoint = this.paths['tasks']['import'];
            const headers = {"Content-Type": "multipart/form-data"};
            return appApi.post(endpoint, request, null, headers);
        } catch (err) {
        }
    }
}

export const testDataSuitesApi = new TestDataSuitesApi();
