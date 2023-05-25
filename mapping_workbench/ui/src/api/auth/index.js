import {createResourceId} from 'src/utils/create-resource-id';
import {decode, JWT_EXPIRES_IN, JWT_SECRET, sign} from 'src/utils/jwt';
import {wait} from 'src/utils/wait';
import axios from 'axios';
import {users} from './data';

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
        const {username, password} = request;

        await wait(500);

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        return axios
            .post(`${API_ADDRESS}/auth/jwt/login`, {
                "username": username,
                "password": password
            }, config)
            .then(function (response) {
                let accessToken = response.data.access_token;
                return {accessToken};
            })
            .catch(function (error) {
                console.log(error, "error");
            });
        return null;
        return new Promise((resolve, reject) => {
            try {
                // Merge static users (data file) with persisted users (browser storage)
                const mergedUsers = [
                    ...users,
                    ...getPersistedUsers()
                ];

                // Find the user
                const user = mergedUsers.find((user) => user.username === username);

                if (!user || (user.password !== password)) {
                    reject(new Error('Please check your username and password'));
                    return;
                }

                // Create the access token
                const accessToken = sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

                resolve({accessToken});
            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
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

    me(request) {
        const {accessToken} = request;

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
        return axios
            .get(`${API_ADDRESS}/users/me`, config)
            .then(function (response) {
                console.log("K :: ", response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error, "error");
            });

        // return new Promise((resolve, reject) => {
        //     try {
        //         // Decode access token
        //         const decodedToken = decode(accessToken);
        //
        //         // Merge static users (data file) with persisted users (browser storage)
        //         const mergedUsers = [
        //             ...users,
        //             ...getPersistedUsers()
        //         ];
        //
        //         // Find the user
        //         const {userId} = decodedToken;
        //         const user = mergedUsers.find((user) => user.id === userId);
        //
        //         if (!user) {
        //             reject(new Error('Invalid authorization token'));
        //             return;
        //         }
        //
        //         resolve({
        //             id: user.id,
        //             avatar: user.avatar,
        //             username: user.username,
        //             name: user.name,
        //             plan: user.plan
        //         });
        //     } catch (err) {
        //         console.error('[Auth Api]: ', err);
        //         reject(new Error('Internal server error'));
        //     }
        // });
    }
}

export const authApi = new AuthApi();
