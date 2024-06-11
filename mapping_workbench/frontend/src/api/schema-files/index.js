import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

class SchemaFilesApi  extends SectionApi {
    get SECTION_TITLE() {
        return "Schema Files";
    }

    get SECTION_ITEM_TITLE() {
        return "Schema Files";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW];
    }

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return 'XLS'
    }

    get FILE_RESOURCE_FORMATS() {
         return {
            "XLS": "XLS"
         }
    }

    constructor() {
        super("schema_files");
        this.isProjectResource = true;
    }

    async getXSDFiles () {
        const endpoint = this.paths['items'];
        return appApi.get(endpoint, {project: sessionApi.getSessionProject()})
    }

}

export const schemaFilesApi = new SchemaFilesApi();
