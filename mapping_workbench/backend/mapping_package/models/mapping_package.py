from typing import Optional, List

from mapping_workbench.backend.core.models.base_entity import BaseNamedEntity


class MappingPackage(BaseNamedEntity):
    title: Optional[str]
    description: Optional[str]
    identifier: Optional[str]
    subtype: Optional[List[str]]
    start_date: Optional[str]
    end_date: Optional[str]
    min_xsd_version: Optional[str]
    max_xsd_version: Optional[str]

    class Settings(BaseNamedEntity.Settings):
        name = "mapping_packages"
