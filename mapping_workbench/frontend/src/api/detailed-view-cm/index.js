import {SectionApi} from "../section";


class DetailedViewCmApi extends SectionApi {
    get SECTION_TITLE() {
        return "Detailed Conceptual Mappings View";
    }

    get SECTION_ITEM_TITLE() {
        return "Detailed Conceptual Mappings View";
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

    async getItems() {
        // GET /api/v1/conceptual_mapping_rules/ontology_framgent/list
        return await {
            items: [
                {
                    "_id": "5eb7cf5a86d9755df3a6c593",
                    "min_sdk_version": "string",
                    "max_sdk_version": "string",
                    "source_structural_element": {
                        "id": "string",
                        "collection": "string"
                    },
                    "target_class_path": "string",
                    "target_property_path": "string",
                    "triple_map_fragment": {
                        "_id": "string",
                        "sdk_element_id": "string",
                        "absolute_xpath": "string"
                    }
                }
            ]
        }
    }
}

export const detailedViewCmApi = new DetailedViewCmApi();
