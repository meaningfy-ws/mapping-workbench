import {appApi} from "../app";

export const SESSION_PROJECT_KEY = 'sessionProject';

class SessionApi {
    getStorage() {
        return sessionStorage;
    }
    async setSessionProject(project) {
        await appApi.post("/users/set_project_for_current_user_session", {"id": project});
        this.getStorage().setItem(SESSION_PROJECT_KEY, project);
    }

    getSessionProject() {
        return this.getStorage().getItem(SESSION_PROJECT_KEY);
    }
}

export const sessionApi = new SessionApi();
