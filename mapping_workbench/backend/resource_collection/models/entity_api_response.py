from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile


class APIListResourceCollectionsPaginatedResponse(APIListPaginatedResponse):
    items: List[ResourceCollection]


class APIListResourceFilesPaginatedResponse(APIListPaginatedResponse):
    items: List[ResourceFile]
