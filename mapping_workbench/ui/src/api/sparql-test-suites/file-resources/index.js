import {FileResourcesApi} from "../../file-collections/file-resources";

class SPARQLTestFileResourcesApi extends FileResourcesApi {
    get SECTION_TITLE() {
        return "SPARQL Test File Resources";
    }

    get SECTION_ITEM_TITLE() {
        return "SPARQL Test File Resource";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "RQ": "RQ"
        };
    }

    constructor() {
        super("sparql_test_suites");
    }
}

export const sparqlTestFileResourcesApi = new SPARQLTestFileResourcesApi();
