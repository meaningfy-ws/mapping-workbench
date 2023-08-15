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

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return "RQ";
    }

    get FILE_RESOURCE_CODE() {
        return {
            "RQ": {
                "grammar": "sparql",
                "language": "sparql"
            }
        };
    }

    constructor() {
        super("sparql_test_suites");
        this.isProjectResource = true;
    }
}

export const sparqlTestFileResourcesApi = new SPARQLTestFileResourcesApi();
