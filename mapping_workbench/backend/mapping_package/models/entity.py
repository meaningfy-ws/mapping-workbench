from datetime import date, datetime
from typing import Optional, List

from beanie import Indexed

from mapping_workbench.backend.core.models.base_entity import BaseTitledEntityListFiltersSchema
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema


class MappingPackageIn(BaseProjectResourceEntityInSchema):
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[date]
    end_date: Optional[date]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]


class MappingPackageCreateIn(MappingPackageIn):
    title: str


class MappingPackageUpdateIn(MappingPackageIn):
    title: Optional[str]


class MappingPackageOut(BaseProjectResourceEntityOutSchema):
    title: Optional[str]
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[date]
    end_date: Optional[date]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]


class MappingPackageListFilters(BaseTitledEntityListFiltersSchema):
    pass


class MappingPackage(BaseProjectResourceEntity):
    title: Indexed(str, unique=True)
    description: Optional[str]
    identifier: Indexed(str, unique=True)
    subtype: Optional[List[str]]
    start_date: Optional[date]
    end_date: Optional[date]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]

    class Settings(BaseProjectResourceEntity.Settings):
        name = "mapping_packages"
        bson_encoders = {
            date: lambda dt: datetime(year=dt.year, month=dt.month, day=dt.day, hour=0, minute=0,
                                      second=0)
        }
