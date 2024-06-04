import {FileResourcesApi} from "../../file-collections/file-resources";

class TestDataFileResourcesApi extends FileResourcesApi {
    get SECTION_TITLE() {
        return "Test Data File Resources";
    }

    get SECTION_ITEM_TITLE() {
        return "Test Data File Resource";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "XML": "XML",
            "JSON": "JSON"
        };
    }

    get FILE_UPLOAD_FORMATS() {
        return {
            "XML": "text/xml",
            "JSON": "application/json"
        }
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return "XML";
    }

    get FILE_RESOURCE_CODE() {
        return {
            "XML": {
                "grammar": "markup",
                "language": "xml"
            },
            "JSON": {
                "grammar": "json",
                "language": "json"
            },
            "RDF": {
                "grammar": "turtle",
                "language": "turtle"
            }
        };
    }

    constructor() {
        super("test_data_suites");
        this.isProjectResource = true;
    }
}

export const testDataFileResourcesApi = new TestDataFileResourcesApi();
