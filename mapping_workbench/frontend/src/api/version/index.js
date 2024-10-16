import {SectionApi} from "../section";

class VersionApi extends SectionApi {

    constructor() {
        super("version");
    }
}

export const versionApi = new VersionApi();
