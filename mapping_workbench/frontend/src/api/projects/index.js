import {SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

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

    async cleanupProject(project_id, request = {}) {
        let endpoint = this.paths['cleanup'].replace(':id', project_id);
        return await appApi.post(endpoint);
    }

    async exportSourceFiles() {
        let endpoint = this.paths['export_source_files'].replace(':id', sessionApi.getSessionProject());
        return appApi.post(endpoint, {}, {}, {}, {
            responseType: 'blob'
        });
    }
}

export const projectsApi = new ProjectsApi();
