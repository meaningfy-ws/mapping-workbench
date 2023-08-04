from typing import Optional, List

from beanie import Link, Indexed

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragment


class TripleMapRegistryIn(BaseEntityInSchema):
    pass


class TripleMapRegistryCreateIn(TripleMapRegistryIn):
    title: str


class TripleMapRegistryUpdateIn(TripleMapRegistryIn):
    title: Optional[str]


class TripleMapRegistryOut(BaseEntityOutSchema):
    title: Optional[str]
    triple_map_fragments: Optional[List[Link[TripleMapFragment]]]


class TripleMapRegistry(BaseEntity):
    title: Indexed(str, unique=True)
    triple_map_fragments: Optional[List[Link[TripleMapFragment]]]

    class Settings(BaseEntity.Settings):
        name = "triple_map_registries"
