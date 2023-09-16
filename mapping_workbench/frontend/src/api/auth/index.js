import {createResourceId} from 'src/utils/create-resource-id';
import {JWT_EXPIRES_IN, JWT_SECRET, sign} from 'src/utils/jwt';
import {wait} from 'src/utils/wait';
import {users} from './data';
import {appApi} from "../app";
import {sessionApi} from "../session";
import {SESSION_PROJECT_KEY} from "../projects";

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
        sessionApi.setLocalSessionProject(user.settings.session.project);
        sessionApi.setLocalAppSettings(user.settings.app.settings);

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
