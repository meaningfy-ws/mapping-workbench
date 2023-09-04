import {SectionApi} from "src/api/section";
import {appApi} from "src/api/app";

export class FileResourcesApi extends SectionApi {
    get FILE_RESOURCE_FORMATS() {
        return {};
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return (this.FILE_RESOURCE_FORMATS && this.FILE_RESOURCE_FORMATS[0]) || '';
    }

    async createCollectionFileResource(collection_id, request) {
        try {
            let endpoint = this.paths['file_resources'].replace(':id', collection_id);
            const headers = {"Content-Type": "multipart/form-data"};
            return await appApi.create(endpoint, request, headers);
        } catch (err) {
        }
    }

    async deleteFileResource(id) {
        let endpoint = this.paths['file_resource'].replace(':id', id);
        let data = await appApi.delete(endpoint);
        return Promise.resolve(data);
    }

    async updateFileResource(id, request) {
        let endpoint = this.paths['file_resource'].replace(':id', id);
        const headers = {"Content-Type": "multipart/form-data"};
        let data = await appApi.update(endpoint, request, headers);
        return Promise.resolve(data);
    }

    async getFileResource(id) {
        let endpoint = this.paths['file_resource'].replace(':id', id);
        let data = await appApi.get(endpoint);
        return Promise.resolve(data);
    }
}

export const fileResourcesApi = new FileResourcesApi();
