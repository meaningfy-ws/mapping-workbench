import {SectionApi} from "../section";

class ProjectsApi extends SectionApi {
    get SECTION_TITLE() {
        return "Projects";
    }

    get SECTION_ITEM_TITLE() {
        return "Project";
    }

    constructor() {
        super("projects");
    }
}

export const projectsApi = new ProjectsApi();
