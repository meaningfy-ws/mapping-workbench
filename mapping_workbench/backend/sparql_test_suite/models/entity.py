from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.sparql_test_suite.models.file_resource import SPARQLTestFileResource


class SPARQLTestSuite(BaseEntity):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link[SPARQLTestFileResource]]]

    class Settings(BaseEntity.Settings):
        name = "sparql_test_suites"
