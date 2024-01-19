from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageOut, MappingPackageState


class APIListMappingPackagesPaginatedResponse(APIListPaginatedResponse):
    items: List[MappingPackageOut]


class APIListMappingPackageStatesPaginatedResponse(APIListPaginatedResponse):
    items: List[MappingPackageState]
