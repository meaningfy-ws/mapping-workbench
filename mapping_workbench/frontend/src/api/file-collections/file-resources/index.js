import {SectionApi} from "src/api/section";
import {appApi} from "src/api/app";
import {sessionApi} from '../../session';

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
        const endpoint = this.paths['file_resource'].replace(':id', id);
        const data = await appApi.get(endpoint);
        return Promise.resolve(data);
    }
// http://localhost:8000/api/v1/test_data_suites/file_resources/678f5c9d607a7f61f94c11c5/transform/history?project=678f5b8d6f271a8aa40e9633

    async getFileHistory(id) {
        const filters = {};
        filters['project'] = sessionApi.getSessionProject();
        const endpoint = this.paths['file_history'].replace(':id', id);
        const data = await appApi.get(endpoint, filters);
        return Promise.resolve(data);
    }
}

export const fileResourcesApi = new FileResourcesApi();
