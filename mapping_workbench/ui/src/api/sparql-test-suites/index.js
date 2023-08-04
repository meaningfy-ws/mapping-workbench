import {FileCollectionsApi} from "../file-collections";

class SPARQLTestSuitesApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "SPARQL Test Suites";
    }

    get SECTION_ITEM_TITLE() {
        return "SPARQL Test Suite";
    }

    constructor() {
        super("sparql_test_suites");
    }
}

export const sparqlTestSuitesApi = new SPARQLTestSuitesApi();
