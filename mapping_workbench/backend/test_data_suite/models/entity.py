from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.test_data_suite.models.file_resource import TestDataFileResource


class TestDataSuite(BaseEntity):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link[TestDataFileResource]]]

    class Settings(BaseEntity.Settings):
        name = "test_data_suites"
