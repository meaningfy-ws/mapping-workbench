from typing import Optional, List

from beanie import Indexed

from mapping_workbench.backend.core.models.base_entity import BaseEntity


class MappingPackage(BaseEntity):
    title: Indexed(str, unique=True)
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[str]
    end_date: Optional[str]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]

    class Settings(BaseEntity.Settings):
        name = "mapping_packages"
