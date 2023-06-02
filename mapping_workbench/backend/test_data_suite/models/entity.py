from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource


class TestDataSuite(BaseEntity):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link["TestDataFileResource"]]] = []

    class Settings(BaseEntity.Settings):
        name = "test_data_suites"
        use_state_management = True


class TestDataFileResourceFormat(Enum):
    XML = "XML"
    JSON = "JSON"


class TestDataFileResource(FileResource):
    format: Optional[TestDataFileResourceFormat]
    test_data_suite: Optional[Link[TestDataSuite]]

    class Settings(FileResource.Settings):
        name = "test_data_file_resources"
