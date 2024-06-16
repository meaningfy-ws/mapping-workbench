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


    constructor() {
        super("schema_files");
        this.isProjectResource = true;
    }

    async getXSDFiles () {
        const endpoint = this.paths['items'];
        return appApi.get(endpoint, {project_id: sessionApi.getSessionProject()})
    }

    async getXSDFile(fileName) {
           try {
            const project = sessionApi.getSessionProject()
            const endpoint = this.paths.file(fileName, project);
            return await appApi.get(endpoint);
        } catch (err) {
        }
    }

}

export const schemaFilesApi = new SchemaFilesApi();
