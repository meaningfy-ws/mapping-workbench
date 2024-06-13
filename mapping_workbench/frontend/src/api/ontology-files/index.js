import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

class OntologyFilesApi  extends SectionApi {
    get SECTION_TITLE() {
        return "Ontology Files";
    }

    get SECTION_ITEM_TITLE() {
        return "Ontology Files";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW];
    }


    constructor() {
        super("ontology_files");
        this.isProjectResource = true;
    }

    async getOntologyFiles () {
        const endpoint = this.paths['items'];
        return appApi.get(endpoint, {project_id: sessionApi.getSessionProject()})
    }

}

export const ontologyFilesApi = new OntologyFilesApi();
