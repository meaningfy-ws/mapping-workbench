import {SectionApi} from "../section";
import {appApi} from "../app";
import {apiPaths} from "../../paths";

class TasksApi {
    get TASKS_TITLE() {
        return "Tasks";
    }

    get TASK_TITLE() {
        return "Task";
    }

    constructor() {
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
}

export const tasksApi = new TasksApi();
