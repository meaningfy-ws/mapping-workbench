from datetime import datetime
from typing import Optional, List

from beanie import Indexed
from pydantic import BaseModel

from mapping_workbench.backend.core.models.api_entity import ApiEntity, ApiEntityMeta, ApiEntitySettings
from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityOutSchema, \
    BaseEntityListFiltersSchema


class MappingPackageIn(BaseModel):
    title: str
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]


class MappingPackageOut(BaseEntityOutSchema):
    title: Optional[str]
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]


class MappingPackageFilters(BaseEntityListFiltersSchema):
    title: Optional[str]


class MappingPackage(BaseEntity, ApiEntity):
    title: Indexed(str, unique=True)
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]

    class Settings(BaseEntity.Settings):
        name = "mapping_packages"

    class ApiSettings(ApiEntitySettings):
        model_create_in: type[BaseModel] = MappingPackageIn
        model_update_in: type[BaseModel] = MappingPackageIn
        model_out: type[BaseModel] = MappingPackageOut
        model_list_filters: type[BaseModel] = MappingPackageFilters
        meta: ApiEntityMeta = ApiEntityMeta(
            route_prefix="/mapping_packages",
            route_tags=["mapping_packages"],
            name_for_one="mapping package",
            name_for_many="mapping packages"
        )
