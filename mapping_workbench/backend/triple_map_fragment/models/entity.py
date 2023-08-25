from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage


class TripleMapFragmentFormat(Enum):
    TTL = "TTL"
    YAML = "YAML"


class SpecificTripleMapFragmentIn(BaseProjectResourceEntityInSchema):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    format: Optional[TripleMapFragmentFormat]
    mapping_package: Optional[Link[MappingPackage]]


class SpecificTripleMapFragmentCreateIn(SpecificTripleMapFragmentIn):
    pass


class SpecificTripleMapFragmentUpdateIn(SpecificTripleMapFragmentIn):
    pass


class SpecificTripleMapFragmentOut(BaseProjectResourceEntityOutSchema):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    format: Optional[TripleMapFragmentFormat]
    mapping_package: Optional[Link[MappingPackage]]


class GenericTripleMapFragmentIn(BaseProjectResourceEntityInSchema):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    format: Optional[TripleMapFragmentFormat]


class GenericTripleMapFragmentCreateIn(GenericTripleMapFragmentIn):
    pass


class GenericTripleMapFragmentUpdateIn(GenericTripleMapFragmentIn):
    pass


class GenericTripleMapFragmentOut(BaseProjectResourceEntityOutSchema):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    format: Optional[TripleMapFragmentFormat]


class TripleMapFragment(BaseProjectResourceEntity):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    format: Optional[TripleMapFragmentFormat]


class SpecificTripleMapFragment(TripleMapFragment):
    mapping_package: Optional[Link[MappingPackage]]

    class Settings(TripleMapFragment.Settings):
        name = "specific_triple_map_fragments"


class GenericTripleMapFragment(TripleMapFragment):
    class Settings(TripleMapFragment.Settings):
        name = "generic_triple_map_fragments"
