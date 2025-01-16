import {apiPaths} from "../../paths";
import {appApi} from "../app";

class DemoConfigApi {
    get SECTION_TITLE() {
        return "Demo Config";
    }

    constructor() {
        this.section = "demoConfig";
        this.paths = apiPaths[this.section];
    }

    async reset() {
        const endpoint = this.paths.reset;
        return appApi.post(endpoint);
    }

}

export const demoConfigApi = new DemoConfigApi();
