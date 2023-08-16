from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.triple_map_fragment.models.entity import SpecificTripleMapFragmentOut, \
    GenericTripleMapFragmentOut


class APIListSpecificTripleMapFragmentsPaginatedResponse(APIListPaginatedResponse):
    items: List[SpecificTripleMapFragmentOut]


class APIListGenericTripleMapFragmentsPaginatedResponse(APIListPaginatedResponse):
    items: List[GenericTripleMapFragmentOut]
