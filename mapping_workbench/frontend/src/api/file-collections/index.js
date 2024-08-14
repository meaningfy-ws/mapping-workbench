import {SectionApi} from "../section";
import {appApi} from "../app";

export class FileCollectionsApi extends SectionApi {
    get REF_MAPPING_PACKAGE_ID() {
        return "mapping_package_id";
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
}

export const fileCollectionsApi = new FileCollectionsApi();
