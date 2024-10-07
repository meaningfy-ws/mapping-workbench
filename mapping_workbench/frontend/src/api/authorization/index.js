import {SectionApi} from "../section";
import {apiPaths} from "../../paths";

class UsersApi extends SectionApi{
    get SECTION_TITLE() {
        return "Authorization";
    }

    constructor() {
        super("users")
        this.section = "users";
        this.paths = apiPaths[this.section];
    }


}

export const usersApi = new UsersApi();
