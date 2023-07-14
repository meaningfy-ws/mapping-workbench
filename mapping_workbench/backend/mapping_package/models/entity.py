from datetime import datetime
from typing import Optional, List

from beanie import Indexed, Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite


class MappingPackage(BaseEntity):
    name: Indexed(str, unique=True)
    title: Optional[str]
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]

    class Settings(BaseEntity.Settings):
        name = "mapping_packages"
