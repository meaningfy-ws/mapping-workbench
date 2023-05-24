from enum import Enum
from typing import Optional

from mapping_workbench.backend.file_resource.models.file_resource import FileResource


class TestDataFileResourceFormat(Enum):
    XML = "XML"
    JSON = "JSON"


class TestDataFileResource(FileResource):
    format: Optional[TestDataFileResourceFormat]

    class Settings(FileResource.Settings):
        name = "test_data_file_resources"
