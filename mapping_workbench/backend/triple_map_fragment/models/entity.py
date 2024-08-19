from enum import Enum
from typing import Optional

import pymongo
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_mapping_package_resource_entity import \
    BaseMappingPackageResourceEntityOutSchema, BaseMappingPackageResourceEntityInSchema, \
    BaseMappingPackageResourceEntityUpdateInSchema, BaseMappingPackageResourceSchemaTrait
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema, BaseProjectResourceEntityUpdateInSchema
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC


class TripleMapFragmentException(Exception):
    pass


class TripleMapFragmentFormat(Enum):
    TTL = "TTL"
    YAML = "YAML"


class SpecificTripleMapFragmentIn(
    BaseProjectResourceEntityInSchema,
    BaseMappingPackageResourceEntityInSchema
):
    identifier: Optional[str] = None
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class SpecificTripleMapFragmentCreateIn(SpecificTripleMapFragmentIn):
    pass


class SpecificTripleMapFragmentUpdateIn(
    BaseProjectResourceEntityUpdateInSchema,
    BaseMappingPackageResourceEntityUpdateInSchema
):
    identifier: Optional[str] = None
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class SpecificTripleMapFragmentOut(
    BaseProjectResourceEntityOutSchema,
    BaseMappingPackageResourceEntityOutSchema
):
    identifier: Optional[str] = None
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class GenericTripleMapFragmentIn(BaseProjectResourceEntityInSchema):
    identifier: Optional[str] = None
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class GenericTripleMapFragmentCreateIn(GenericTripleMapFragmentIn):
    pass


class GenericTripleMapFragmentUpdateIn(GenericTripleMapFragmentIn):
    pass


class GenericTripleMapFragmentOut(BaseProjectResourceEntityOutSchema):
    identifier: Optional[str] = None
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class TripleMapFragmentState(ObjectState):
    identifier: Optional[str] = None
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None


class TripleMapFragment(BaseProjectResourceEntity, StatefulObjectABC):
    identifier: Optional[str] = None
    triple_map_uri: Optional[str] = None
    triple_map_content: Optional[str] = None
    format: Optional[TripleMapFragmentFormat] = None

    async def get_state(self) -> TripleMapFragmentState:
        return TripleMapFragmentState(
            identifier=self.identifier,
            triple_map_uri=self.triple_map_uri,
            triple_map_content=self.triple_map_content,
            format=self.format
        )

    def set_state(self, state: TripleMapFragmentState):
        raise TripleMapFragmentException("Setting the state of a Triple Map Fragment is not supported.")


class SpecificTripleMapFragment(TripleMapFragment, BaseMappingPackageResourceSchemaTrait):
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
