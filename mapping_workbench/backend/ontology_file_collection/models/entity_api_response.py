from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.ontology_file_collection.models.entity import OntologyFileResource, \
    OntologyFileCollection


class APIListOntologyFileCollectionsPaginatedResponse(APIListPaginatedResponse):
    items: List[OntologyFileCollection]


class APIListOntologyFileResourcesPaginatedResponse(APIListPaginatedResponse):
    items: List[OntologyFileResource]
