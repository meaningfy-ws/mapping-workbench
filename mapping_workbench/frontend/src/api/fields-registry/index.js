import {SectionApi} from "../section";

class FieldsRegistryApi extends SectionApi {
    get SECTION_TITLE() {
        return "Fields Registry";
    }

    get SECTION_ITEM_TITLE() {
        return "Fields Registry";
    }

    constructor() {
        super("fields_registry");
    }
}

export const fieldsRegistryApi = new FieldsRegistryApi();
