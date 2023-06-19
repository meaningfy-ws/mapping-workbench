import {FileCollectionsApi} from "../file-collections";

class PackageCollectionsApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "Package Collections";
    }

    get SECTION_ITEM_TITLE() {
        return "Package Collection";
    }

    constructor() {
        super("package_collections");
    }
}

export const packageCollectionsApi = new PackageCollectionsApi();
