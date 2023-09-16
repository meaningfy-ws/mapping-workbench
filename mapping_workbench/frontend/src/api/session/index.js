import {appApi} from "../app";
import {apiPaths} from "../../paths";

export const SESSION_PROJECT_KEY = 'sessionProject';
export const APP_SETTINGS_KEY = 'app.settings';

class SessionApi {
    getStorage() {
        return sessionStorage;
    }

    async setSessionProject(project) {
        await appApi.post(apiPaths.session.session_project, {"id": project});
        this.setLocalSessionProject(project);
    }

    setLocalSessionProject(project) {
        this.getStorage().setItem(SESSION_PROJECT_KEY, project);
    }

    getSessionProject() {
        return this.getStorage().getItem(SESSION_PROJECT_KEY);
    }

    async setAppSettings(data, isAuthenticated) {
        if (isAuthenticated) {
            await appApi.post(apiPaths.session.app_settings, {"data": data});
        }
        this.setLocalAppSettings(data);
    }

    setLocalAppSettings(data) {
        localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(data));
    }
}

export const sessionApi = new SessionApi();
