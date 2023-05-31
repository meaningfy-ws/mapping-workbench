from enum import Enum
from typing import Optional

from mapping_workbench.backend.file_resource.models.file_resource import FileResource


class SPARQLTestFileResourceFormat(Enum):
    RQ = "RQ"


class SPARQLTestFileResource(FileResource):
    format: Optional[SPARQLTestFileResourceFormat]

    class Settings(FileResource.Settings):
        name = "sparql_test_file_resources"
