from datetime import datetime
from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link, PydanticObjectId
from pydantic import BaseModel
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement, StructuralElementState
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroup, MappingGroupState
from mapping_workbench.backend.ontology.models.term import TermValidityResponse
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource, SPARQLTestState
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment, TripleMapFragmentState
from mapping_workbench.backend.user.models.user import User


class ConceptualMappingRuleException(Exception):
    pass


class ConceptualMappingRuleTermsValidity(Enum):
    VALID = "valid"
    INVALID = "invalid"


class ConceptualMappingRuleCommentPriority(Enum):
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"


class ConceptualMappingRuleComment(BaseModel):
    title: Optional[str] = None
    comment: Optional[str] = None
    priority: Optional[ConceptualMappingRuleCommentPriority] = ConceptualMappingRuleCommentPriority.NORMAL
    created_at: Optional[datetime] = None
    created_by: Optional[Link[User]] = None
    updated_at: Optional[datetime] = None
    updated_by: Optional[Link[User]] = None


class ConceptualMappingRuleIn(BaseProjectResourceEntityInSchema):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Optional[Link[StructuralElement]] = None
    mapping_groups: Optional[List[Link[MappingGroup]]] = None
    target_class_path: Optional[str] = None
    target_property_path: Optional[str] = None
    refers_to_mapping_package_ids: Optional[List[PydanticObjectId]] = []
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None
    status: Optional[str] = None
    mapping_notes: Optional[List[ConceptualMappingRuleComment]] = None
    editorial_notes: Optional[List[ConceptualMappingRuleComment]] = None
    feedback_notes: Optional[List[ConceptualMappingRuleComment]] = None


class ConceptualMappingRuleCreateIn(ConceptualMappingRuleIn):
    pass


class ConceptualMappingRuleUpdateIn(ConceptualMappingRuleIn):
    pass


class ConceptualMappingRuleOut(BaseProjectResourceEntityOutSchema):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Optional[Link[StructuralElement]] = None
    mapping_groups: Optional[List[Link[MappingGroup]]] = None
    target_class_path: Optional[str] = None
    target_class_path_terms_validity: Optional[List[TermValidityResponse]] = None
    target_property_path: Optional[str] = None
    target_property_path_terms_validity: Optional[List[TermValidityResponse]] = None
    terms_validity: Optional[ConceptualMappingRuleTermsValidity] = None
    refers_to_mapping_package_ids: Optional[List[PydanticObjectId]] = []
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None
    status: Optional[str] = None
    mapping_notes: Optional[List[ConceptualMappingRuleComment]] = None
    editorial_notes: Optional[List[ConceptualMappingRuleComment]] = None
    feedback_notes: Optional[List[ConceptualMappingRuleComment]] = None
    sort_order: Optional[float] = None


class ConceptualMappingRuleState(ObjectState):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Optional[StructuralElementState] = None
    mapping_groups: Optional[List[MappingGroupState]] = None
    target_class_path: Optional[str] = None
    target_property_path: Optional[str] = None
    triple_map_fragment: Optional[TripleMapFragmentState] = None
    sparql_assertions: Optional[List[SPARQLTestState]] = None
    status: Optional[str] = None
    mapping_notes: Optional[List[ConceptualMappingRuleComment]] = None
    editorial_notes: Optional[List[ConceptualMappingRuleComment]] = None
    feedback_notes: Optional[List[ConceptualMappingRuleComment]] = None
    sort_order: Optional[float] = None


class ConceptualMappingRule(BaseProjectResourceEntity, StatefulObjectABC):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Optional[Link[StructuralElement]] = None
    mapping_groups: Optional[List[Link[MappingGroup]]] = None
    target_class_path: Optional[str] = None
    target_class_path_terms_validity: Optional[List[TermValidityResponse]] = None
    target_property_path: Optional[str] = None
    target_property_path_terms_validity: Optional[List[TermValidityResponse]] = None
    terms_validity: Optional[ConceptualMappingRuleTermsValidity] = None
    refers_to_mapping_package_ids: Optional[List[PydanticObjectId]] = []
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None
    status: Optional[str] = None
    mapping_notes: Optional[List[ConceptualMappingRuleComment]] = None
    editorial_notes: Optional[List[ConceptualMappingRuleComment]] = None
    feedback_notes: Optional[List[ConceptualMappingRuleComment]] = None
    sort_order: Optional[float] = None

    async def get_state(self) -> ConceptualMappingRuleState:
        source_structural_element = await self.source_structural_element.fetch() \
            if self.source_structural_element else None
        triple_map_fragment = await self.triple_map_fragment.fetch() if self.triple_map_fragment else None
        sparql_assertions_states = []
        if self.sparql_assertions:
            sparql_assertions = [await sparql_assertion.fetch() for sparql_assertion in self.sparql_assertions]
            if sparql_assertions:
                sparql_assertions_states = [await sparql_assertion.get_state() for sparql_assertion in
                                            sparql_assertions]

        mapping_groups_states = []
        if self.mapping_groups:
            mapping_groups = [await mapping_group.fetch() for mapping_group in self.mapping_groups]
            if mapping_groups:
                mapping_groups_states = [await mapping_group.get_state() for mapping_group in mapping_groups]

        return ConceptualMappingRuleState(
            min_sdk_version=self.min_sdk_version,
            max_sdk_version=self.max_sdk_version,
            source_structural_element=(
                await source_structural_element.get_state()
            ) if source_structural_element else None,
            target_class_path=self.target_class_path,
            target_property_path=self.target_property_path,
            triple_map_fragment=(
                await triple_map_fragment.get_state()
            ) if triple_map_fragment else None,
            sparql_assertions=sparql_assertions_states,
            status=self.status,
            mapping_notes=self.mapping_notes,
            editorial_notes=self.editorial_notes,
            feedback_notes=self.feedback_notes,
            sort_order=self.sort_order,
            mapping_groups=mapping_groups_states,
        )

    def set_state(self, state: ConceptualMappingRuleState):
        raise ConceptualMappingRuleException("Setting the state of a conceptual mapping rule is not supported.")

    class Settings(BaseProjectResourceEntity.Settings):
        name = "conceptual_mapping_rules"
        indexes = [
            IndexModel(
                [
                    ("target_class_path", pymongo.TEXT),
                    ("target_property_path", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]
