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

    async getValuesForSelector(request = {}) {
        let valuesStore = await this.getItems();
        return valuesStore.items.map(
            value => ({id: value._id, title: value.title})
        ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const testDataSuitesApi = new TestDataSuitesApi();
