import {createResourceId} from 'src/utils/create-resource-id';
import {JWT_EXPIRES_IN, JWT_SECRET, sign} from 'src/utils/jwt';
import {wait} from 'src/utils/wait';
import {users} from './data';
import {appApi} from "../app";

const STORAGE_KEY = 'users';
const API_ADDRESS = process.env.API_ADDRESS;

// NOTE: We use sessionStorage since memory storage is lost after page reload.
//  This should be replaced with a server call that returns DB persisted data.

const getPersistedUsers = () => {
    try {
        const data = sessionStorage.getItem(STORAGE_KEY);

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
        sessionStorage.setItem(STORAGE_KEY, data);
    } catch (err) {
        console.error(err);
    }
};

class AuthApi {
    async signIn(request) {
        return appApi.signIn(request);
    }

    async signUp(request) {
        const {username, name, password} = request;

        await wait(1000);

        return new Promise((resolve, reject) => {
            try {
                // Merge static users (data file) with persisted users (browser storage)
                const mergedUsers = [
                    ...users,
                    ...getPersistedUsers()
                ];

                // Check if a user already exists
                let user = mergedUsers.find((user) => user.username === username);

                if (user) {
                    reject(new Error('User already exists'));
                    return;
                }

                user = {
                    id: createResourceId(),
                    avatar: undefined,
                    username,
                    name,
                    password,
                    plan: 'Standard'
                };

                persistUser(user);

                const accessToken = sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

                resolve({accessToken});
            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async me(request) {
        console.log("AUTH :: ME");
        return await appApi.get('/users/me');
    }
}

export const authApi = new AuthApi();
