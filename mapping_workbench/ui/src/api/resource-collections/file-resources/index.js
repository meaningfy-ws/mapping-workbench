import {FileResourcesApi} from "../../file-collections/file-resources";

class ResourceFilesApi extends FileResourcesApi {
    get SECTION_TITLE() {
        return "Resource Files";
    }

    get SECTION_ITEM_TITLE() {
        return "Resource File";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "CSV": "CSV",
            "JSON": "JSON"
        };
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return "JSON";
    }

    get FILE_RESOURCE_CODE() {
        return {
            "CSV": {
                "grammar": "csv",
                "language": "csv"
            },
            "JSON": {
                "grammar": "json",
                "language": "json"
            }
        };
    }

    constructor() {
        super("resource_collections");
        this.isProjectResource = true;
    }
}

export const resourceFilesApi = new ResourceFilesApi();
