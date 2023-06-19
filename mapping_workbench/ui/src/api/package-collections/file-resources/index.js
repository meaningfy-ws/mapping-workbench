import {FileResourcesApi} from "../../file-collections/file-resources";

class PackageFilesApi extends FileResourcesApi {
    get SECTION_TITLE() {
        return "Package Files";
    }

    get SECTION_ITEM_TITLE() {
        return "Package File";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "CSV": "CSV",
            "JSON": "JSON"
        };
    }

    constructor() {
        super("package_collections");
    }
}

export const packageFilesApi = new PackageFilesApi();
