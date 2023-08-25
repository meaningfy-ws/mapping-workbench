from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource


class SPARQLQueryValidationType(Enum):
    CM_ASSERTION = "cm_assertion"
    INTEGRATION_TEST = "integration_test"

class SPARQLTestSuite(BaseProjectResourceEntity):
    title: Optional[str]
    description: Optional[str]
    type: Optional[SPARQLQueryValidationType]
    file_resources: Optional[List[Link["SPARQLTestFileResource"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "sparql_test_suites"


class SPARQLTestFileResourceFormat(Enum):
    RQ = "RQ"


class SPARQLTestFileResource(FileResource):
    format: Optional[SPARQLTestFileResourceFormat]
    type: Optional[SPARQLQueryValidationType]
    sparql_test_suite: Optional[Link[SPARQLTestSuite]]

    class Settings(FileResource.Settings):
        name = "sparql_test_file_resources"
