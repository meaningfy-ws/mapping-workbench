import axios from "axios";
import {api as apiConfig} from 'src/config';
import {STORAGE_KEY as ACCESS_TOKEN_STORAGE_KEY} from 'src/contexts/auth/jwt/auth-provider';
import {sessionStorageTokenInterceptor} from './security';

const LOGIN_ENDPOINT = "/auth/jwt/login";
const LOGOUT_ENDPOINT = "/auth/jwt/logout";

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
        if (error.response && error.response.status === 401) {
            this.removeAccessToken();
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

    async request(method, endpoint, data = null, params = null, headers = null) {
        headers = this.addAuth(headers);

        const config = {
            method: method,
            url: this.url(endpoint),
            headers: headers
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
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(method, "REQUEST");
                $this.processError(error);
                console.log(error, "error");
            });
    }

    async get(endpoint, params = null) {
        return this.request(METHOD.GET, endpoint, null, params);
    }

    async post(endpoint, data, params = null, headers = null) {
        return this.request(METHOD.POST, endpoint, data, null, headers);
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

    async delete(endpoint) {
        return this.request(METHOD.DELETE, endpoint);
    }

    async signIn(request) {
        const {username, password} = request;

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        let $this = this;
        return axios
            .post(this.url(LOGIN_ENDPOINT), {
                "username": username,
                "password": password
            }, config)
            .then(function (response) {
                let accessToken = response.data.access_token;
                $this.setAccessToken(accessToken);
                return {accessToken};
            })
            .catch(function (error) {
                console.log(error, "error");
            });
    }

    async signOut() {
        const config = {
            headers: this.addAuth()
        }

        let $this = this;
        return axios
            .post(this.url(LOGOUT_ENDPOINT), config)
            .then(function (response) {
                let accessToken = response.data.access_token;
                $this.removeAccessToken();
            })
            .catch(function (error) {
                console.log(error, "error");
            });
    }

    async listItems() {

    }
}

export const appApi = new AppApi();
