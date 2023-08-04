from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragmentOut


class APIListTripleMapFragmentsPaginatedResponse(APIListPaginatedResponse):
    items: List[TripleMapFragmentOut]
