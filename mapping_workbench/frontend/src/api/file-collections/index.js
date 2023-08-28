import {SectionApi} from "../section";
import {appApi} from "../app";

export class FileCollectionsApi extends SectionApi {
    async getFileResources(id, request = {}) {
        const { filters, page, rowsPerPage } = request;
        let endpoint = this.paths['file_resources'].replace(':id', id);
        let {items, count} = await appApi.get(endpoint);

        return Promise.resolve({
            items,
            count
        });
    }
}

export const fileCollectionsApi = new FileCollectionsApi();
