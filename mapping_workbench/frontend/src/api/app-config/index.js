import {appApi} from "../app";
import {apiPaths} from "../../paths";

class AppConfigApi {

    async getSettings() {
        return await appApi.get(apiPaths.app.settings);
    }
}

export const appConfigApi = new AppConfigApi();
