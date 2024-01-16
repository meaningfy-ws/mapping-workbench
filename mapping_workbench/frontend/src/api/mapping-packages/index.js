import {SectionApi} from "../section";
import {appApi} from "../app";

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
        return mappingPackagesStore.items && mappingPackagesStore.items.map(
            mappingPackage => ({
                id: mappingPackage._id,
                title: mappingPackage.title,
                identifier: mappingPackage.identifier
            })
        ).sort((a, b) => a.title.localeCompare(b.title)) || [];
    }

    importPackage(request) {
        try {
            let endpoint = this.paths['import'];
            const headers = {"Content-Type": "multipart/form-data"};
            return appApi.post(endpoint, request, null, headers);
        } catch (err) {
        }
    }
}

export const mappingPackagesApi = new MappingPackagesApi();
