from enum import Enum
from typing import Optional

import pymongo
from beanie import PydanticObjectId
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_mapping_package_resource_entity import \
    BaseMappingPackageResourceEntityOutSchema, BaseMappingPackageResourceEntityInSchema, \
    BaseMappingPackageResourceEntityUpdateInSchema
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema, BaseProjectResourceEntityUpdateInSchema


class TripleMapFragmentFormat(Enum):
    TTL = "TTL"
    YAML = "YAML"


class SpecificTripleMapFragmentIn(
    BaseProjectResourceEntityInSchema,
    BaseMappingPackageResourceEntityInSchema
):
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class SpecificTripleMapFragmentCreateIn(SpecificTripleMapFragmentIn):
    pass


class SpecificTripleMapFragmentUpdateIn(
    BaseProjectResourceEntityUpdateInSchema,
    BaseMappingPackageResourceEntityUpdateInSchema
):
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class SpecificTripleMapFragmentOut(
    BaseProjectResourceEntityOutSchema,
    BaseMappingPackageResourceEntityOutSchema
):
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


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
    mapping_package_id: Optional[PydanticObjectId] = None

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
