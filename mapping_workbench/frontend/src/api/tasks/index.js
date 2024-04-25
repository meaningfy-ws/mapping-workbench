import {SectionApi} from "../section";
import {appApi} from "../app";
import {apiPaths} from "../../paths";

class TasksApi extends SectionApi{
    get TASKS_TITLE() {
        return "Tasks";
    }

    get TASK_TITLE() {
        return "Task";
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

    async cancelTask(reuquest = {}) {
        // appApi.post(endpoint, filt)
    }
}

export const tasksApi = new TasksApi();
