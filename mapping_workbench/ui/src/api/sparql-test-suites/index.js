import {SectionApi} from "../section";
import {paths} from "../../paths";
import {appApi} from "../app";

class SPARQLTestSuitesApi extends SectionApi {
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
