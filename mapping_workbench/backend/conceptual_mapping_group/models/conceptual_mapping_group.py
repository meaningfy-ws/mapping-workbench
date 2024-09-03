from functools import cached_property
from itertools import zip_longest
from typing import List, Optional

import pymongo
from beanie import Link, PydanticObjectId
from pydantic import BaseModel, computed_field
from pymongo import IndexModel

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.ontology.models.term import Term


class ConceptualMappingGroupNameOut(BaseModel):
    id: PydanticObjectId
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    group_name: str
    related_node: str
    iterator_xpath: str
    instance_type: str


class ConceptualMappingGroupNameListOut(BaseModel):
    items: List[ConceptualMappingGroupNameOut]


class ConceptualMappingGroup(BaseModel):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None

    @computed_field
    @cached_property
    def group_name(self) -> str:  # Mapping Group ID
        # Temporary solution
        # TODO: To change when Ontology Path is implemented
        class_path_list = self.cm_rule.target_class_path.split(" / ")

        property_path = self.cm_rule.target_property_path
        property_path = property_path.replace("?this", '')
        property_path = property_path.replace("?value", '')
        property_path = property_path.replace(".", '')
        property_path = property_path.strip()
        property_path_list = property_path.split(" / ")

        ontology_path = [element.split(":")[-1] for pair in zip_longest(class_path_list, property_path_list) for element in pair if
                         element is not None]
        return "MG-" + "-".join(ontology_path)

    instance_type: Term
    cm_rule: ConceptualMappingRule


class ConceptualMappingGroupBeanie(BaseProjectResourceEntity):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    instance_type: Link[Term]
    cm_rule: Link[ConceptualMappingRule]
    group_name: str

    class Settings(BaseProjectResourceEntity.Settings):
        name = "conceptual_mapping_groups"

        indexes = [
            IndexModel(
                [
                    ("project.$id", pymongo.ASCENDING),
                    ("group_name", pymongo.TEXT),
                ],
                unique=True,
                name="mapping_groups_index"
            )
        ]
