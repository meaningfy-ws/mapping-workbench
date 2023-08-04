import {FileCollectionsApi} from "../file-collections";

class ResourceCollectionsApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "Resource Collections";
    }

    get SECTION_ITEM_TITLE() {
        return "Resource Collection";
    }

    constructor() {
        super("resource_collections");
    }
}

export const resourceCollectionsApi = new ResourceCollectionsApi();
