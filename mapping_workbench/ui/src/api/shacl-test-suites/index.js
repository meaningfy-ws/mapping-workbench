import {FileCollectionsApi} from "../file-collections";

class SHACLTestSuitesApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "SHACL Test Suites";
    }

    get SECTION_ITEM_TITLE() {
        return "SHACL Test Suite";
    }

    constructor() {
        super("shacl_test_suites");
        this.isProjectResource = true;
    }
}

export const shaclTestSuitesApi = new SHACLTestSuitesApi();
