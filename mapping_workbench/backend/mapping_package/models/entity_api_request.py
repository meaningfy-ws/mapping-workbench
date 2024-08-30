from typing import List

from pydantic import BaseModel

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageOut, MappingPackageStateGate


class APIDeleteMappingPackageRequest(BaseModel):
    cleanup_project: bool = False
