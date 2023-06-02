import {FileResourcesApi} from "../../file-collections/file-resources";

class SHACLTestFileResourcesApi extends FileResourcesApi {
    get SECTION_TITLE() {
        return "SHACL Test File Resources";
    }

    get SECTION_ITEM_TITLE() {
        return "SHACL Test File Resource";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "SHACL_TTL": "SHACL.TTL"
        };
    }

    constructor() {
        super("shacl_test_suites");
    }
}

export const shaclTestFileResourcesApi = new SHACLTestFileResourcesApi();
