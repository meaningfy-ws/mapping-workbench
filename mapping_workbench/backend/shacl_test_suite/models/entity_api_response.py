from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource


class APIListSHACLTestSuitesPaginatedResponse(APIListPaginatedResponse):
    items: List[SHACLTestSuite]


class APIListSHACLTestFileResourcesPaginatedResponse(APIListPaginatedResponse):
    items: List[SHACLTestFileResource]
