from datetime import datetime
from typing import Optional, List

from beanie import Indexed, Link

from mapping_workbench.backend.core.models.base_entity import BaseTitledEntityListFiltersSchema
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite


class MappingPackageIn(BaseProjectResourceEntityInSchema):
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]
    test_data_suites: Optional[List[Link[TestDataSuite]]]
    sparql_test_suites: Optional[List[Link[SPARQLTestSuite]]]
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]]


class MappingPackageCreateIn(MappingPackageIn):
    title: str


class MappingPackageUpdateIn(MappingPackageIn):
    title: Optional[str]


class MappingPackageOut(BaseProjectResourceEntityOutSchema):
    title: Optional[str]
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]
    test_data_suites: Optional[List[Link[TestDataSuite]]]
    sparql_test_suites: Optional[List[Link[SPARQLTestSuite]]]
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]]


class MappingPackageListFilters(BaseTitledEntityListFiltersSchema):
    pass


class MappingPackage(BaseProjectResourceEntity):
    title: Indexed(str, unique=True)
    description: Optional[str]
    identifier: Indexed(str, unique=True)
    subtype: Optional[List[str]]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]
    test_data_suites: Optional[List[Link[TestDataSuite]]]
    sparql_test_suites: Optional[List[Link[SPARQLTestSuite]]]
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]]

    class Settings(BaseProjectResourceEntity.Settings):
        name = "mapping_packages"
