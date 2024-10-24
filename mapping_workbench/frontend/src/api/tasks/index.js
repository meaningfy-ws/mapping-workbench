import {SectionApi} from "../section";
import {appApi} from "../app";
import {apiPaths} from "../../paths";

class TasksApi extends SectionApi {
    get TASKS_TITLE() {
        return "Activities";
    }

    get TASK_TITLE() {
        return "Activity";
    }

    constructor() {
        super("tasks")
        this.section = "tasks";
        this.paths = apiPaths[this.section];
    }

    async runTermsValidator(request = {}) {
        try {
            let endpoint = this.paths['terms_validator'];
            let filters = {}
            if (request['filters']) {
                filters = request['filters'];
            }
            return appApi.post(endpoint, filters);
        } catch (err) {
        }
    }

    async runGenerateCMAssertionsQueries(request = {}) {
        try {
            let endpoint = this.paths['generate_cm_assertions_queries'];
            let filters = {}
            if (request['filters']) {
                filters = request['filters'];
            }
            return appApi.post(endpoint, filters);
        } catch (err) {
        }
    }

    async runTransformTestData(request = {}) {
        try {
            let endpoint = this.paths['transform_test_data'];
            let filters = {}
            if (request['filters']) {
                filters = request['filters'];
            }
            return appApi.post(endpoint, filters);
        } catch (err) {
        }
    }

    async cancelTask(id) {
        const endpoint = this.paths['task_cancel'];
        return appApi.post(endpoint(id));
    }

    async deleteTask(id) {
        const endpoint = this.paths['task_delete'];
        return appApi.delete(endpoint(id));
    }

    async deleteAllTasks() {
        const endpoint = this.paths['task_delete_all'];
        return appApi.delete(endpoint);
    }

    async getTasks() {
        const endpoint = this.paths['items'];
        return appApi.get(endpoint);
    }
}

export const tasksApi = new TasksApi();
