import {FileCollectionsApi} from "../file-collections";

class TestDataSuitesApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "Test Data Suites";
    }

    get SECTION_ITEM_TITLE() {
        return "Test Data Suite";
    }

    constructor() {
        super("test_data_suites");
        this.isProjectResource = true;
    }
}

export const testDataSuitesApi = new TestDataSuitesApi();
