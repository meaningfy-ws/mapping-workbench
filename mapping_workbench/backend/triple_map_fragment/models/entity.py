from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage


class TripleMapFragmentIn(BaseEntityInSchema):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]


class TripleMapFragmentCreateIn(TripleMapFragmentIn):
    pass


class TripleMapFragmentUpdateIn(TripleMapFragmentIn):
    pass


class TripleMapFragmentOut(BaseEntityOutSchema):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    refers_to_mapping_packages: Optional[List[Link["MappingPackage"]]]


class TripleMapFragment(BaseEntity):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    refers_to_mapping_packages: Optional[List[Link["MappingPackage"]]]

    @property
    def is_specific(self):
        return len(self.refers_to_mapping_packages) > 0

    class Settings(BaseEntity.Settings):
        name = "triple_map_fragments"

