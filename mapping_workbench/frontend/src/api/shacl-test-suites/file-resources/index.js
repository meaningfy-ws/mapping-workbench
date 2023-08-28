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
            "SHACL.TTL": "SHACL.TTL"
        };
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return "SHACL.TTL";
    }

    get FILE_RESOURCE_CODE() {
        return {
            "SHACL.TTL": {
                "grammar": "turtle",
                "language": "turtle"
            }
        };
    }

    constructor() {
        super("shacl_test_suites");
        this.isProjectResource = true;
    }
}

export const shaclTestFileResourcesApi = new SHACLTestFileResourcesApi();
