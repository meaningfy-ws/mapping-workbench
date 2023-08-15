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
}

export const mappingPackagesApi = new MappingPackagesApi();
