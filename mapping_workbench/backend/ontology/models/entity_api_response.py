from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.ontology.models.namespace import NamespaceOut


class APIListNamespacesPaginatedResponse(APIListPaginatedResponse):
    items: List[NamespaceOut]
