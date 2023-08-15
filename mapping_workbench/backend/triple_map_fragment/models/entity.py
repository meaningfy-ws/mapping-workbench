from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage


class TripleMapFragmentIn(BaseProjectResourceEntityInSchema):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]


class TripleMapFragmentCreateIn(TripleMapFragmentIn):
    pass


class TripleMapFragmentUpdateIn(TripleMapFragmentIn):
    pass


class TripleMapFragmentOut(BaseProjectResourceEntityOutSchema):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    belongs_to_mapping_packages: Optional[List[Link["MappingPackage"]]]


class TripleMapFragment(BaseProjectResourceEntity):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    belongs_to_mapping_packages: Optional[List[Link["MappingPackage"]]]

    @property
    def is_specific(self):
        return len(self.belongs_to_mapping_packages) > 0

    class Settings(BaseProjectResourceEntity.Settings):
        name = "triple_map_fragments"

