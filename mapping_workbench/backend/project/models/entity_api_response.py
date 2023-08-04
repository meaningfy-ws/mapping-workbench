from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.project.models.entity import ProjectOut


class APIListProjectsPaginatedResponse(APIListPaginatedResponse):
    items: List[ProjectOut]
