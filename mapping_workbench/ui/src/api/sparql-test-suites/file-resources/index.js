import {FileResourcesApi} from "../../file-collections/file-resources";

const FILE_RESOURCE_TYPE_INTEGRATION_TEST_VALUE = "integration_test";

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

    get FILE_RESOURCE_TYPES() {
        let types = {
            "cm_assertion": "CM Assertion"
        }
        types[FILE_RESOURCE_TYPE_INTEGRATION_TEST_VALUE] = "Integration Test";
        return types;
    }

    constructor() {
        super("sparql_test_suites");
        this.isProjectResource = true;
        this.hasFileResourceType = true;
    }

    async getMappingRuleResources(request = {}) {
        request['filters'] = {
            type: FILE_RESOURCE_TYPE_INTEGRATION_TEST_VALUE
        };
        let sparqlTestFileResourcesStore = await this.getItems(request, "free_file_resources");
        return sparqlTestFileResourcesStore.items.map(
            sparqlTestFileResource => ({
                id: sparqlTestFileResource._id,
                title: sparqlTestFileResource.title + (
                    sparqlTestFileResource.filename ? " (" + sparqlTestFileResource.filename + ")" : ""
                )
            })
        ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const sparqlTestFileResourcesApi = new SPARQLTestFileResourcesApi();
