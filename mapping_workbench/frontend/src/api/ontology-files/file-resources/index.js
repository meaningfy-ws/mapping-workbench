import {FileResourcesApi} from "../../file-collections/file-resources";
import {appApi} from "../../app";
import {sessionApi} from "../../session";

class OntologyFileResourcesApi extends FileResourcesApi {

    get FILE_RESOURCE_FORMATS() {
        return {
            "TTL": "TTL"
        };
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return "TTL";
    }

   get FILE_UPLOAD_FORMATS() {
        return {'TTL': {['text/ttl']:['.ttl']}}
    }

    get FILE_RESOURCE_CODE() {
        return {
            "TTL": {
                "grammar": "ttl",
                "language": "ttl"
            }
        };
    }

    async createCollectionFileResource(request) {
        try {
            const project = sessionApi.getSessionProject()
            const endpoint = this.paths.addFile(project);
            return await appApi.create(endpoint, request);
        } catch (err) {
        }
    }

    async deleteFileResource(fileName) {
           try {
            const project = sessionApi.getSessionProject()
            const endpoint = this.paths.deleteFile(fileName, project);
            return await appApi.delete(endpoint);
        } catch (err) {
        }
    }

    constructor() {
        super("ontology_files");
        this.isProjectResource = true;
    }
}

export const ontologyFileResourcesApi = new OntologyFileResourcesApi();
