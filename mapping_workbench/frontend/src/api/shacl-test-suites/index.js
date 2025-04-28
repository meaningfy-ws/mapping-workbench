import {FileCollectionsApi} from "../file-collections";
import {appApi} from "../app";

class SHACLTestSuitesApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "SHACL Test Suites";
    }

    get SECTION_ITEM_TITLE() {
        return "SHACL Test Suite";
    }

    get MAPPING_PACKAGE_LINK_FIELD() {
        return "shacl_test_suites"
    }

    constructor() {
        super("shacl_test_suites");
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

    importFileCollections(request) {
        try {
            let endpoint = this.paths['tasks']['import'];
            const headers = {"Content-Type": "multipart/form-data"};
            return appApi.post(endpoint, request, null, headers);
        } catch (err) {
        }
    }
}

export const shaclTestSuitesApi = new SHACLTestSuitesApi();
