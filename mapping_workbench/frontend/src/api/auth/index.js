import {appApi} from "../app";
import {sessionApi} from "../session";

const STORAGE_KEY = 'users';

// NOTE: We use sessionStorage since memory storage is lost after page reload.
//  This should be replaced with a server call that returns DB persisted data.

const getPersistedUsers = () => {
    try {
        const data = sessionApi.getStorage().getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return [];
    }
};

const persistUser = (user) => {
    try {
        const users = getPersistedUsers();
        const data = JSON.stringify([...users, user]);
        sessionApi.getStorage().setItem(STORAGE_KEY, data);
    } catch (err) {
        console.error(err);
    }
};

class AuthApi {
    async signIn(request) {
        return appApi.signIn(request);
    }

    async signInWithSessionInit(request) {
        await this.signIn(request);
        const user = await this.me();
        if (user.settings.session && user.settings.session.project) {
            sessionApi.setLocalSessionProject(user.settings.session.project);
        }
        if (user.settings.app && user.settings.app.settings) {
            sessionApi.setLocalAppSettings(user.settings.app.settings);
        } else if (sessionApi.getLocalAppSettings()) {
            await sessionApi.setAppSettings(JSON.parse(sessionApi.getLocalAppSettings()), !!user);
        }

        return user;
    }

    async signOut() {
        return appApi.signOut();
    }

    async signUp(request) {
        return appApi.signUp(request);
    }

    async me() {
        return await appApi.me();
    }

    async verifyAuth() {
        return await appApi.verifyAuth();
    }
}

export const authApi = new AuthApi();
