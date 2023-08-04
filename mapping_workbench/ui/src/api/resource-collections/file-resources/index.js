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

    constructor() {
        super("resource_collections");
    }
}

export const resourceFilesApi = new ResourceFilesApi();
