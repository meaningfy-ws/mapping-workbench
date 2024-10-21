import axios from "axios";
import {api as apiConfig} from 'src/config';
import {STORAGE_KEY as ACCESS_TOKEN_STORAGE_KEY} from 'src/contexts/auth/jwt/auth-provider';
import {sessionStorageTokenInterceptor} from './security';
import {HTTPException} from "./exceptions";
import {apiPaths, paths} from "../../paths";
import {securityApi} from "../security";
import {SESSION_PROJECT_KEY} from "../projects";

const LOGIN_ENDPOINT = "/auth/jwt/login";
const LOGOUT_ENDPOINT = "/auth/jwt/logout";
const REGISTER_ENDPOINT = "/auth/register";
const VERIFY_TOKEN_ENDPOINT = "/auth/verify";
const MISSING_PARAMETER = "/424"

const METHOD = {
    GET: 'get',
    POST: 'post',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete'
};

class AppApi {
    constructor() {
        this.config = apiConfig;
        this.apiClient = this.getApiClient(this.config);
    }

    sessionStorage() {
        return window.sessionStorage;
    }

    localStorage() {
        return window.localStorage;
    }

    url(endpoint) {
        return `${this.config.address}${this.config.baseUrl}${endpoint}`;
    }

    getAccessToken() {
        return this.sessionStorage().getItem(ACCESS_TOKEN_STORAGE_KEY);
    }

    setAccessToken(data) {
        return this.sessionStorage().setItem(ACCESS_TOKEN_STORAGE_KEY, data);
    }

    removeAccessToken() {
        return this.sessionStorage().removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }

    removeProject() {
        return this.sessionStorage().removeItem(SESSION_PROJECT_KEY);
    }

    addAuth(headers = null) {
        headers = headers || {};
        headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
        return headers;
    }

    addRequestContentType(headers = null) {
        headers = headers || {};
        headers['Content-Type'] = 'application/json';
        return headers;
    }

    processError(error) {
        if (error.response?.status === 401) {
            this.removeAccessToken();
            window.location.replace(LOGIN_ENDPOINT);
        }
        if (error.response?.status === 424) {
            this.removeProject()
            window.location.replace(MISSING_PARAMETER)
        }
    }

    getApiClient(config) {
        let initialConfig = {
            baseURL: `${config.address}${config.baseUrl}`
        }
        let client = axios.create(initialConfig)
        client.interceptors.request.use(sessionStorageTokenInterceptor)
        return client
    }

    async me() {
        try {
            const res = await axios
                .get(this.url(apiPaths.session.me), {
                    headers: this.addAuth()
                });
            return res?.data;
        } catch (err) {
            await this.signOut();
            return null;
        }
    }


    async verifyAuth() {
        try {
            const user = await this.me();
            if (!user) {
                await this.signOut();
                return null;
            }
            return user;
        } catch (e) {
            console.log(e)
        }
        return null;
    }

    async request(method, endpoint, data = null, params = null, headers = null, extraConfig = null) {
        // if (!(await this.verifyAuth())) {
        //     history.push(paths.auth.jwt.login);
        //     return;
        // }

        headers = this.addAuth(headers);

        const config = {
            method: method,
            url: this.url(endpoint),
            headers: headers
        }
        if (extraConfig) {
            Object.assign(config, extraConfig)
        }

        if (data !== null) {
            config.data = data;
        }
        if (params !== null) {
            config.params = params;
            config.paramsSerializer = {indexes: null}
        }
        let $this = this;
        return axios
            .request(config)
            .then(response => response.data)
            .catch(error => {
                console.log(method, "REQUEST", error.response?.status);
                $this.processError(error);
                console.log(error, "error");
                throw error
            });
    }

    async get(endpoint, params = null, headers = null, extraConfig = null) {
        return this.request(METHOD.GET, endpoint, null, params, headers, extraConfig);
    }

    async post(endpoint, data = {}, params = null, headers = null) {
        return this.request(METHOD.POST, endpoint, data, params, headers);
    }

    async create(endpoint, data, headers = null) {
        return this.post(endpoint, data, null, headers);
    }

    async patch(endpoint, data, headers = {}) {
        return this.request(METHOD.PATCH, endpoint, data, null, headers);
    }

    async update(endpoint, data, headers = {}) {
        return this.patch(endpoint, data, headers);
    }

    async delete(endpoint, data = null) {
        return this.request(METHOD.DELETE, endpoint, data);
    }

    async verifyAuthToken() {
        const result = await appApi.post(VERIFY_TOKEN_ENDPOINT, {
            "token": this.getAccessToken()
        });
        return !(!result || result.detail === 'VERIFY_USER_BAD_TOKEN');

    }

    authenticate(data) {
        let accessToken = data.access_token;
        this.setAccessToken(accessToken);
        return {accessToken};
    }

    async authWithCheckUserIsVerified(data){
        this.authenticate(data);
        const user = await this.get(apiPaths.session.user_check_verified)

        if (!securityApi.isUserVerified(user)) {
            await this.signOut();
            window.location.replace(paths.accountNotVerified);
            return false;
        }
        return true;
    }

    async signIn(request) {
        const {username, password, remember_me} = request;

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        let data = {
            "username": username,
            "password": password
        }
        if (remember_me) {
            data['remember_me'] = true
        }

        try {
            const response = await axios.post(this.url(LOGIN_ENDPOINT), data, config);
            return await this.authWithCheckUserIsVerified(response.data)
        } catch (err) {
            console.log(err, "error");
            throw new HTTPException(err)
        }
    }

    async signUp(request) {
        const config = {}
        const {username, name, password} = request;
        return axios
            .post(this.url(REGISTER_ENDPOINT), {
                email: username,
                name: name,
                password: password
            }, config)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error, "error");
                throw new HTTPException(error)
            });
    }

    async signOut() {
        const config = {
            headers: this.addAuth()
        }

        try {
            await axios.post(this.url(LOGOUT_ENDPOINT), null, config);
            this.removeAccessToken();
            return true;
        } catch (err) {
            console.log(err, "error");
            throw new HTTPException(err)
        }
    }

    async listItems() {

    }
}

export const appApi = new AppApi();
