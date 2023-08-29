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

    async getValuesForSelector(request = {}) {
        let valuesStore = await this.getItems();
        return valuesStore.items.map(
            value => ({id: value._id, title: value.title})
        ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const shaclTestSuitesApi = new SHACLTestSuitesApi();
