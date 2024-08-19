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

    async getValuesForSelector(request = {}) {
        let valuesStore = await this.getItems();
        return valuesStore.items.map(
            value => ({id: value._id, title: value.title})
        ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const resourceCollectionsApi = new ResourceCollectionsApi();
