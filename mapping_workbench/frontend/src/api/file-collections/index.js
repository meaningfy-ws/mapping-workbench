import {SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

export class FileCollectionsApi extends SectionApi {
    get REF_MAPPING_PACKAGE_ID() {
        return "mapping_package_id";
    }

    get MAPPING_PACKAGE_LINK_FIELD() {
        return null
    }

    async getFileResources(id, request = {}) {
        const {
            filters = {},
            page = this.DEFAULT_PAGE,
            rowsPerPage = this.DEFAULT_ROWS_PER_PAGE
        } = request;
        filters['page'] = page;
        filters['limit'] = rowsPerPage >= 0 ? rowsPerPage : null;

        let endpoint = this.paths['file_resources'].replace(':id', id);
        return await appApi.get(endpoint, filters);
    }

    assignMappingPackages(idsToAssignTo, toMappingPackages) {
        if (!('assign_mapping_packages' in this.paths)) {
            return;
        }
        let endpoint = this.paths['assign_mapping_packages'];
        let request = {
            project: sessionApi.getSessionProject(),
            resources_ids: idsToAssignTo,
            mapping_packages_ids: toMappingPackages
        }
        return appApi.post(endpoint, request);
    }
}

export const fileCollectionsApi = new FileCollectionsApi();
