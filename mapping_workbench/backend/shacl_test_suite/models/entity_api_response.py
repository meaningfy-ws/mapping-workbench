from typing import List, Optional

from beanie import Link

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.file_resource.models.file_resource import FileResourceIn
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource, \
    SHACLTestFileResourceFormat


class APIListSHACLTestSuitesPaginatedResponse(APIListPaginatedResponse):
    items: List[SHACLTestSuite]


class APIListSHACLTestFileResourcesPaginatedResponse(APIListPaginatedResponse):
    items: List[SHACLTestFileResource]

class SHACLTestFileResourceIn(FileResourceIn):
    format: Optional[SHACLTestFileResourceFormat] = None


class SHACLTestFileResourceCreateIn(SHACLTestFileResourceIn):
    shacl_test_suite: Optional[Link[SHACLTestSuite]] = None


class SHACLTestFileResourceUpdateIn(SHACLTestFileResourceIn):
    pass