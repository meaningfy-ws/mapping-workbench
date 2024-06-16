import {FileResourcesApi} from "../../file-collections/file-resources";
import {appApi} from "../../app";
import {sessionApi} from "../../session";

class SchemaFileResourcesApi extends FileResourcesApi {
    get SECTION_TITLE() {
        return "SHACL Test File Resources";
    }

    get SECTION_ITEM_TITLE() {
        return "SHACL Test File Resource";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "XSD": "XSD"
        };
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return "XSD";
    }

   get FILE_UPLOAD_FORMATS() {
        return {'XSD': {['text/xsd']:['.xsd']}}
    }

    get FILE_RESOURCE_CODE() {
        return {
            "XSD": {
                "grammar": "xsd",
                "language": "xsd"
            }
        };
    }

    async createCollectionFileResource(request) {
        try {
            const project = sessionApi.getSessionProject()
            const endpoint = this.paths.file(project);
            // const headers = {"Content-Type": "multipart/form-data"};
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
        super("schema_files");
        this.isProjectResource = true;
    }
}

export const schemaFileResourcesApi = new SchemaFileResourcesApi();
