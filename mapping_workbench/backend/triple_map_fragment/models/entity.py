from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage


class TripleMapFragmentFormat(Enum):
    TTL = "TTL"
    YAML = "YAML"


class SpecificTripleMapFragmentIn(BaseProjectResourceEntityInSchema):
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None
    mapping_package: Optional[Link[MappingPackage]] = None


class SpecificTripleMapFragmentCreateIn(SpecificTripleMapFragmentIn):
    pass


class SpecificTripleMapFragmentUpdateIn(SpecificTripleMapFragmentIn):
    pass


class SpecificTripleMapFragmentOut(BaseProjectResourceEntityOutSchema):
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None
    mapping_package: Optional[Link[MappingPackage]] = None


class GenericTripleMapFragmentIn(BaseProjectResourceEntityInSchema):
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class GenericTripleMapFragmentCreateIn(GenericTripleMapFragmentIn):
    pass


class GenericTripleMapFragmentUpdateIn(GenericTripleMapFragmentIn):
    pass


class GenericTripleMapFragmentOut(BaseProjectResourceEntityOutSchema):
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class TripleMapFragment(BaseProjectResourceEntity):
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class SpecificTripleMapFragment(TripleMapFragment):
    mapping_package: Optional[Link[MappingPackage]] = None

    class Settings(TripleMapFragment.Settings):
        name = "specific_triple_map_fragments"

        indexes = [
            IndexModel(
                [
                    ("triple_map_uri", pymongo.TEXT),
                    ("triple_map_content", pymongo.TEXT),
                    ("format", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]


class GenericTripleMapFragment(TripleMapFragment):
    class Settings(TripleMapFragment.Settings):
        name = "generic_triple_map_fragments"

        indexes = [
            IndexModel(
                [
                    ("triple_map_uri", pymongo.TEXT),
                    ("triple_map_content", pymongo.TEXT),
                    ("format", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]
