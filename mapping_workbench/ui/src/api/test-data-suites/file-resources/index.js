import {FileResourcesApi} from "../../file-collections/file-resources";

class TestDataFileResourcesApi extends FileResourcesApi {
    get SECTION_TITLE() {
        return "Test Data File Resources";
    }

    get SECTION_ITEM_TITLE() {
        return "Test Data File Resource";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "XML": "XML",
            "JSON": "JSON"
        };
    }

    constructor() {
        super("test_data_suites");
    }
}

export const testDataFileResourcesApi = new TestDataFileResourcesApi();
