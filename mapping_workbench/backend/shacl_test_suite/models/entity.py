from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource


class SHACLTestSuite(BaseProjectResourceEntity):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link["SHACLTestFileResource"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "shacl_test_suites"
        use_state_management = True


class SHACLTestFileResourceFormat(Enum):
    SHACL_TTL = "SHACL.TTL"


class SHACLTestFileResource(FileResource):
    format: Optional[SHACLTestFileResourceFormat]
    shacl_test_suite: Optional[Link[SHACLTestSuite]]

    class Settings(FileResource.Settings):
        name = "shacl_test_file_resources"
