import {SectionApi} from "../section";
import {appApi} from "../app";

export const SESSION_PROJECT_KEY = 'sessionProject';

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

    async getSessionProjects(request = {}) {
        let projectsStore = await this.getItems();
        return projectsStore.items.map(
            project => ({id: project._id, title: project.title})
        ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const projectsApi = new ProjectsApi();
