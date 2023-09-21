from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn


class TestDataSuite(FileResourceCollection):
    file_resources: Optional[List[Link["TestDataFileResource"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "test_data_suites"
        use_state_management = True


class TestDataFileResourceFormat(Enum):
    XML = "XML"
    JSON = "JSON"


class TestDataFileResourceIn(FileResourceIn):
    format: Optional[TestDataFileResourceFormat] = None


class TestDataFileResourceCreateIn(TestDataFileResourceIn):
    test_data_suite: Optional[Link[TestDataSuite]] = None


class TestDataFileResourceUpdateIn(TestDataFileResourceIn):
    pass


class TestDataFileResource(FileResource):
    format: Optional[TestDataFileResourceFormat] = None
    test_data_suite: Optional[Link[TestDataSuite]] = None

    class Settings(FileResource.Settings):
        name = "test_data_file_resources"
