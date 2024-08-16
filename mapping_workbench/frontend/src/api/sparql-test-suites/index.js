import {FileCollectionsApi} from "../file-collections";

class SPARQLTestSuitesApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "SPARQL Test Suites";
    }

    get SECTION_ITEM_TITLE() {
        return "SPARQL Test Suite";
    }

    get FILE_COLLECTION_TYPES() {
        return {
            "cm_assertion": "CM Assertions",
            "integration_test": "Integration Tests",
            "other": "Other"
        };
    }

    constructor() {
        super("sparql_test_suites");
        this.isProjectResource = true;
        this.hasFileCollectionType = true;
    }

    async getValuesForSelector(request = {}) {
        let valuesStore = await this.getItems();
        return valuesStore.items.filter(value => value.title !== 'cm_assertions').map(
            value => ({id: value._id, title: value.title})
        ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const sparqlTestSuitesApi = new SPARQLTestSuitesApi();
