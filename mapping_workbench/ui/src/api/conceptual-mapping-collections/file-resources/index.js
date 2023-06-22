import {FileResourcesApi} from "../../file-collections/file-resources";

class ConceptualMappingFilesApi extends FileResourcesApi {
    get SECTION_TITLE() {
        return "Conceptual Mapping Files";
    }

    get SECTION_ITEM_TITLE() {
        return "Conceptual Mapping File";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "CSV": "CSV",
            "JSON": "JSON"
        };
    }

    constructor() {
        super("conceptual_mapping_collections");
    }
}

export const conceptualMappingFilesApi = new ConceptualMappingFilesApi();