import {SectionApi} from "../section";
import {apiPaths} from "../../paths";
import {appApi} from "../app";

class UsersApi extends SectionApi {
    get SECTION_TITLE() {
        return "Authorization";
    }

    constructor() {
        super("users")
        this.section = "users";
        this.paths = apiPaths[this.section];
    }

    async getRoles() {
        const endpoint = this.paths.roles;
        return appApi.get(endpoint);
    }

    async authorize(ids) {
        const endpoint = this.paths['authorize']
        return appApi.post(endpoint, {ids})
    }

    async unauthorize(ids) {
        const endpoint = this.paths['unauthorize']
        return appApi.post(endpoint, {ids})
    }

    async update_roles(ids,roles){
        const endpoint = this.paths['update_roles']
        return appApi.post(endpoint, {ids,roles})

    }


}

export const usersApi = new UsersApi();
