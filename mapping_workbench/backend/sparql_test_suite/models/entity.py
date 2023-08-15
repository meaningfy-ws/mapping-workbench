from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource


class SPARQLTestSuite(BaseProjectResourceEntity):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link["SPARQLTestFileResource"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "sparql_test_suites"


class SPARQLTestFileResourceFormat(Enum):
    RQ = "RQ"


class SPARQLTestFileResource(FileResource):
    format: Optional[SPARQLTestFileResourceFormat]
    sparql_test_suite: Optional[Link[SPARQLTestSuite]]

    class Settings(FileResource.Settings):
        name = "sparql_test_file_resources"
