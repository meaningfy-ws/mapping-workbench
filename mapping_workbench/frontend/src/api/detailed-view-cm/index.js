import {SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";


class DetailedViewCmApi extends SectionApi {
    get SECTION_TITLE() {
        return "Conceptual Mappings Rules";
    }

    get SECTION_ITEM_TITLE() {
        return "Conceptual Mappings Rules";
    }

    constructor() {
        super("detailed_view_cm");
    }

    async getList() {
        // /api/v1/ontology_fragment/list
        return await {
            items: [
                {
                    ontology_fragment_id: "876b7d2j333",
                    ontology_fragment_name: "epo:AwardCriterion"
                },
                {
                    ontology_fragment_id: "87h57d2433jk3",
                    ontology_fragment_name: "epo:Notice"
                }
            ]
        }
    }

    async getItems(request) {
        const {
            filters = {},
            page = this.DEFAULT_PAGE,
            rowsPerPage = this.DEFAULT_ROWS_PER_PAGE
        } = request;
        filters['project_id'] = sessionApi.getSessionProject();
        filters['page'] = page;
        filters['limit'] = rowsPerPage >= 0 ? rowsPerPage : null;

        const endpoint = this.paths['items'];
        return await appApi.get(endpoint, filters);
    }
}

export const detailedViewCmApi = new DetailedViewCmApi();
