from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource


class SHACLTestSuite(BaseEntity):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link["SHACLTestFileResource"]]] = []

    class Settings(BaseEntity.Settings):
        name = "shacl_test_suites"
        use_state_management = True


class SHACLTestFileResourceFormat(Enum):
    SHACL_TTL = "SHACL.TTL"


class SHACLTestFileResource(FileResource):
    format: Optional[SHACLTestFileResourceFormat]
    shacl_test_suite: Optional[Link[SHACLTestSuite]]

    class Settings(FileResource.Settings):
        name = "shacl_test_file_resources"
