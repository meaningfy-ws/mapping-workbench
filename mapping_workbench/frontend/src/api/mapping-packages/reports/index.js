import {appApi} from "../../app";

const REPORT_FILTER_PATH_PREFIX = "filters.";

export class MappingPackageFiltersApi {
    storage() {
        return appApi.sessionStorage();
    }

    genKey(section, name) {
        return REPORT_FILTER_PATH_PREFIX + section + "." + name;
    }

    setFilter(section, name, value) {
        this.storage().setItem(this.genKey(section, name), value);
    }

    getFilter(section, name) {
        return this.storage().getItem(this.genKey(section, name));
    }
}
