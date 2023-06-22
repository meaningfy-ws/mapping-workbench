import {FileCollectionsApi} from "../file-collections";

class ConceptualMappingCollectionsApi extends FileCollectionsApi {
    get SECTION_TITLE() {
        return "Conceptual Mapping Collections";
    }

    get SECTION_ITEM_TITLE() {
        return "Conceptual Mapping Collection";
    }

    constructor() {
        super("conceptual_mapping_collections");
    }
}

export const conceptualMappingCollectionsApi = new ConceptualMappingCollectionsApi();