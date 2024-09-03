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

    get MAPPING_PACKAGE_LINK_FIELD() {
        return "sparql_test_suites"
    }

    get CM_ASSERTIONS_SUITE_TITLE() {
        return 'cm_assertions';
    }

    constructor() {
        super("sparql_test_suites");
        this.isProjectResource = true;
        this.hasFileCollectionType = true;
    }

    async getValuesForSelector(request = {}) {
        request.page = 0;
        request.rowsPerPage = -1;
        let valuesStore = await this.getItems(request);
        return valuesStore.items.filter(value => value.title !== this.CM_ASSERTIONS_SUITE_TITLE).map(
            value => ({id: value._id, title: value.title})
        ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const sparqlTestSuitesApi = new SPARQLTestSuitesApi();
