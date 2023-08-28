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

    get FILE_RESOURCE_DEFAULT_FORMAT() {
        return "RDF";
    }

    get FILE_RESOURCE_CODE() {
        return {
            "OWL": {
                "grammar": "turtle",
                "language": "turtle"
            },
            "RDF": {
                "grammar": "turtle",
                "language": "turtle"
            }
        };
    }

    constructor() {
        super("ontology_file_collections");
        this.isProjectResource = true;
    }
}

export const ontologyFileResourcesApi = new OntologyFileResourcesApi();
