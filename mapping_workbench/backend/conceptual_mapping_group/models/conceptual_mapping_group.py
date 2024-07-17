from typing import List, Optional

import pymongo
from beanie import Link, PydanticObjectId
from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.ontology.models.term import Term


class ConceptualMappingGroupNameOut(BaseModel):
    id: PydanticObjectId
    name: str


class ConceptualMappingGroupListNamesOut(BaseModel):
    items: List[ConceptualMappingGroupNameOut]


class ConceptualMappingGroupTreeOut(BaseModel):
    root: "ConceptualMappingGroup"


class ConceptualMappingGroup(BaseProjectResourceEntity):
    # min_sdk_version and max_sdk_version also should be inserted, but in not for now

    name: str  # Mapping group ID
    iterator_xpath: str
    instance_type: Link[Term]  # Ontology Class

    children_groups: Optional[List[Link["ConceptualMappingGroup"]]] = []
    parent_group: Optional[Link["ConceptualMappingGroup"]] = None  # None means root

    class Settings(BaseProjectResourceEntity.Settings):
        name = "mapping_groups"

        indexes = [
            pymongo.IndexModel(
                [("name", pymongo.DESCENDING),
                 ("iterator_xpath", pymongo.DESCENDING),
                 ("project", pymongo.DESCENDING)],
                name="cmg_index_DESCENDING",
                unique=True
            ),
        ]
