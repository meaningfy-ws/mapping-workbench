from datetime import datetime
from typing import Optional, List

from beanie import Indexed, Link

from mapping_workbench.backend.core.models.base_entity import BaseTitledEntityListFiltersSchema
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite


class MappingPackageIn(BaseProjectResourceEntityInSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    identifier: Optional[str] = None
    subtype: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_xsd_version: Optional[str] = None
    max_xsd_version: Optional[str] = None
    test_data_suites: Optional[List[Link[TestDataSuite]]] = None
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]] = None


class MappingPackageCreateIn(MappingPackageIn):
    title: str


class MappingPackageUpdateIn(MappingPackageIn):
    pass


class MappingPackageImportIn(MappingPackageIn):
    created_at: Optional[datetime] = None


class MappingPackageOut(BaseProjectResourceEntityOutSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    identifier: Optional[str] = None
    subtype: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_xsd_version: Optional[str] = None
    max_xsd_version: Optional[str] = None
    test_data_suites: Optional[List[Link[TestDataSuite]]] = None
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]] = None


class MappingPackageListFilters(BaseTitledEntityListFiltersSchema):
    pass


class MappingPackage(BaseProjectResourceEntity):
    title: Indexed(str, unique=True)
    description: Optional[str] = None
    identifier: Indexed(str, unique=True)
    subtype: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_xsd_version: Optional[str] = None
    max_xsd_version: Optional[str] = None
    test_data_suites: Optional[List[Link[TestDataSuite]]] = None
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]] = None

    class Settings(BaseProjectResourceEntity.Settings):
        name = "mapping_packages"

