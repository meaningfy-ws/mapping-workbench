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
        this.isProjectResource = true;
    }
}

export const resourceCollectionsApi = new ResourceCollectionsApi();
