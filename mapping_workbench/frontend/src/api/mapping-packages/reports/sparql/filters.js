import {MappingPackageFiltersApi} from "..";

const SPARQL_REPORT_FILTER_PATH = "sparql";

class SPARQLFiltersApi extends MappingPackageFiltersApi {
    setFilter(name, value) {
        super.setFilter(SPARQL_REPORT_FILTER_PATH, name, value);
    }

    getFilter(name) {
        return super.getFilter(SPARQL_REPORT_FILTER_PATH, name);
    }

    setShowMatchedXPATHsOnly(value) {
        this.setFilter("showMatchedXPATHsOnly", value);
    }

    getShowMatchedXPATHsOnly() {
        return this.getFilter("showMatchedXPATHsOnly") === "true";
    }
}

export const sparqlReportFiltersApi = new SPARQLFiltersApi();
