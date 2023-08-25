import {SectionApi} from "../section";

class MappingPackagesApi extends SectionApi {
    get SECTION_TITLE() {
        return "Mapping Packages";
    }

    get SECTION_ITEM_TITLE() {
        return "Mapping Package";
    }

    constructor() {
        super("mapping_packages");
        this.isProjectResource = true;
    }

    async getProjectPackages(request = {}) {
        let mappingPackagesStore = await this.getItems(request);
        return mappingPackagesStore.items.map(
            mappingPackage => ({id: mappingPackage._id, title: mappingPackage.title})
        ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const mappingPackagesApi = new MappingPackagesApi();
