import {FileResourcesApi} from "../../file-collections/file-resources";
import {appApi} from "../../app";

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


    get FILE_RESOURCE_CODE() {
        return {
            "XSD": {
                "grammar": "xsd",
                "language": "xsd"
            }
        };
    }

    async createCollectionFileResource(project_id, request) {
        try {
            const endpoint = this.paths.file(project_id);
            const headers = {"Content-Type": "multipart/form-data"};
            return await appApi.create(endpoint, request, headers);
        } catch (err) {
        }
    }

    constructor() {
        super("schema_files");
        this.isProjectResource = true;
    }
}

export const schemaFileResourcesApi = new SchemaFileResourcesApi();
