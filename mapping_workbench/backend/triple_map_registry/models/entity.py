from typing import Optional, List

from beanie import Link, Indexed

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityOutSchema, BaseProjectResourceEntityInSchema
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragment


class TripleMapRegistryIn(BaseProjectResourceEntityInSchema):
    pass


class TripleMapRegistryCreateIn(TripleMapRegistryIn):
    title: str


class TripleMapRegistryUpdateIn(TripleMapRegistryIn):
    title: Optional[str] = None


class TripleMapRegistryOut(BaseProjectResourceEntityOutSchema):
    title: Optional[str] = None
    triple_map_fragments: Optional[List[Link[TripleMapFragment]]] = None


class TripleMapRegistry(BaseProjectResourceEntity):
    title: Indexed(str, unique=True)
    triple_map_fragments: Optional[List[Link[TripleMapFragment]]] = None

    class Settings(BaseProjectResourceEntity.Settings):
        name = "triple_map_registries"
