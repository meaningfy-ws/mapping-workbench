import {wait} from "../../utils/wait";
import axios from "axios";
import {STORAGE_KEY, STORAGE_KEY as ACCESS_TOKEN_STORAGE_KEY} from 'src/contexts/auth/jwt/auth-provider';

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
        this.address = process.env.API_ADDRESS;
    }

    sessionStorage() {
        return window.sessionStorage;
    }

    localStorage() {
        return window.localStorage;
    }

    url(endpoint) {
        return `${this.address}${endpoint}`;
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

    processError(error) {
        if (error.response && error.response.status == 401) {
            this.removeAccessToken();
        }
    }

    async request(method, endpoint, data = null) {
        const config = {
            method: method,
            url: this.url(endpoint),
            headers: this.addAuth()
        }
        if (data !== null) {
            config.data = data;
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

    async get(endpoint) {
        return this.request(METHOD.GET, endpoint);
    }

    async post(endpoint, data) {
        return this.request(METHOD.POST, endpoint, data);
    }

    async create(endpoint, data) {
        return this.post(endpoint, data);
    }

    async patch(endpoint, data) {
        return this.request(METHOD.PATCH, endpoint, data);
    }

    async update(endpoint, data) {
        return this.patch(endpoint, data);
    }

    async delete(endpoint) {
        return this.request(METHOD.DELETE, endpoint);
    }

    async signIn(request) {
        const {username, password} = request;

        await wait(500);

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
