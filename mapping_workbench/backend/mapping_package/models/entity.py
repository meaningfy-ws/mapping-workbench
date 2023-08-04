from datetime import date, datetime
from typing import Optional, List

from beanie import Indexed, Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema, \
    BaseTitledEntityListFiltersSchema
from mapping_workbench.backend.project.models.entity import Project


class MappingPackageIn(BaseEntityInSchema):
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


class MappingPackageOut(BaseEntityOutSchema):
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


class MappingPackage(BaseEntity):
    title: Indexed(str, unique=True)
    description: Optional[str]
    identifier: Indexed(str, unique=True)
    subtype: Optional[List[str]]
    start_date: Optional[date]
    end_date: Optional[date]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]
    refers_to_projects: Optional[List[Link[Project]]]

    class Settings(BaseEntity.Settings):
        name = "mapping_packages"
        bson_encoders = {
            date: lambda dt: datetime(year=dt.year, month=dt.month, day=dt.day, hour=0, minute=0,
                                      second=0)
        }
