from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.triple_map_registry.models.entity import TripleMapRegistryOut


class APIListTripleMapRegistriesPaginatedResponse(APIListPaginatedResponse):
    items: List[TripleMapRegistryOut]
