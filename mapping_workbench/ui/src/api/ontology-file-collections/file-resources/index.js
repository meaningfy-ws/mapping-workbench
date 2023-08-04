import {FileResourcesApi} from "../../file-collections/file-resources";

class OntologyFileResourcesApi extends FileResourcesApi {
    get SECTION_TITLE() {
        return "Ontology File Resources";
    }

    get SECTION_ITEM_TITLE() {
        return "Ontology File Resource";
    }

    get FILE_RESOURCE_FORMATS() {
        return {
            "OWL": "OWL",
            "RDF": "RDF"
        };
    }

    constructor() {
        super("ontology_file_collections");
    }
}

export const ontologyFileResourcesApi = new OntologyFileResourcesApi();
