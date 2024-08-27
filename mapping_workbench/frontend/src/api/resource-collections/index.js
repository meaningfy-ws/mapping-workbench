import {FileCollectionsApi} from "../file-collections";

class ResourceCollectionsApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "Resource Collections";
    }

    get SECTION_ITEM_TITLE() {
        return "Resource Collection";
    }

    get MAPPING_PACKAGE_LINK_FIELD() {
        return "resource_collections"
    }

    constructor() {
        super("resource_collections");
        this.isProjectResource = true;
    }

    async getValuesForSelector(request = {}) {
        request.page = 0;
        request.rowsPerPage = -1;
        let valuesStore = await this.getItems(request);
        return valuesStore.items.map(
            value => ({id: value._id, title: value.title})
        ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const resourceCollectionsApi = new ResourceCollectionsApi();
