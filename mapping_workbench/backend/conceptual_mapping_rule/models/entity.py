from datetime import datetime
from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link, PydanticObjectId
from dateutil.tz import tzlocal
from pydantic import BaseModel, Field, field_validator
from pydantic_core.core_schema import ValidationInfo
from pymongo import IndexModel

from mapping_workbench.backend import DEFAULT_MODEL_CONFIG
from mapping_workbench.backend.core.models.base_mapping_package_resource_entity import \
    BaseMappingPackagesResourceEntityInSchema, BaseMappingPackagesResourceEntityOutSchema, \
    BaseMappingPackagesResourceSchemaTrait
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement, StructuralElementState
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroupState, MappingGroup
from mapping_workbench.backend.ontology.models.term import TermValidityResponse
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource, SPARQLTestState
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment, TripleMapFragmentState
from mapping_workbench.backend.user.models.user import User, UserRef


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
    priority: Optional[ConceptualMappingRuleCommentPriority] | Optional[
        str] = ConceptualMappingRuleCommentPriority.NORMAL
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(tzlocal()))
    created_by: Optional[Link[User]] = None
    updated_at: Optional[datetime] = None
    updated_by: Optional[Link[User]] = None


class ConceptualMappingRuleCommentOut(BaseModel):
    comment: str
    created_by: Optional[UserRef]


class ConceptualMappingRuleCommentIn(BaseModel):
    comment: str


class CMRuleStatus(str, Enum):
    UNDER_DEVELOPMENT = "Under development"
    FOR_INTERNAL_REVIEW = "For internal review"
    FOR_INTERNAL_CONSULTATION = "For internal consultation"
    FOR_CLIENT_CONSULTATION = "For OP consultation"
    FOR_INTERNAL_CONSULTATION_AFTER_REVIEW = "For internal consultation (after review)"
    APPROVED_BY_FIRST_INTERNAL_REVIEWER = "Approved by first internal reviewer"
    APPROVED_BY_SECOND_INTERNAL_REVIEWER = "Approved by second internal reviewer"
    FOR_CLIENT_REVIEW_DONE = "For OP review (done)"
    APPROVED_BY_FIRST_CLIENT_REVIEW = "Approved by first OP reviewer"
    APPROVED_BY_CLIENT_ACCEPTED = "Approved by OP (Accepted)"
    CHANGE_REQUESTED_BY_CLIENT = "Change requested by OP"
    UPDATED_BASED_ON_CLIENT_REVIEW = "Updated based on OP review"

    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))


class ConceptualMappingRuleIn(BaseProjectResourceEntityInSchema, BaseMappingPackagesResourceEntityInSchema):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Link[StructuralElement]
    mapping_groups: Optional[List[Link[MappingGroup]]] = None
    xpath_condition: Optional[str] = None
    target_class_path: Optional[str] = None
    target_property_path: Optional[str] = None
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None
    status: Optional[str] = None
    mapping_notes: Optional[List[ConceptualMappingRuleComment]] = None
    editorial_notes: Optional[List[ConceptualMappingRuleComment]] = None
    feedback_notes: Optional[List[ConceptualMappingRuleComment]] = None


class ConceptualMappingRuleCreateIn(ConceptualMappingRuleIn):
    """

    """
    source_structural_element: Link[StructuralElement]


class ConceptualMappingRuleUpdateIn(ConceptualMappingRuleIn):
    """

    """
    source_structural_element: Optional[Link[StructuralElement]] = None


class ConceptualMappingRuleOut(BaseProjectResourceEntityOutSchema, BaseMappingPackagesResourceEntityOutSchema):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Optional[Link[StructuralElement]] = None
    source_structural_element_sdk_element_id: Optional[str] = None
    source_structural_element_absolute_xpath: Optional[str] = None
    mapping_groups: Optional[List[Link[MappingGroup]]] = None
    xpath_condition: Optional[str] = None
    target_class_path: Optional[str] = None
    target_class_path_terms_validity: Optional[List[TermValidityResponse]] = None
    target_property_path: Optional[str] = None
    target_property_path_terms_validity: Optional[List[TermValidityResponse]] = None
    terms_validity: Optional[ConceptualMappingRuleTermsValidity] = None
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None
    status: Optional[str] = None
    mapping_notes: Optional[List[ConceptualMappingRuleComment]] = None
    editorial_notes: Optional[List[ConceptualMappingRuleComment]] = None
    feedback_notes: Optional[List[ConceptualMappingRuleComment]] = None
    sort_order: Optional[float] = None


class ConceptualMappingRuleState(ObjectState):
    oid: Optional[PydanticObjectId] = None
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Optional[StructuralElementState] = None
    mapping_groups: Optional[List[MappingGroupState]] = None
    xpath_condition: Optional[str] = None
    target_class_path: Optional[str] = None
    target_property_path: Optional[str] = None
    triple_map_fragment: Optional[TripleMapFragmentState] = None
    sparql_assertions: Optional[List[SPARQLTestState]] = None
    status: Optional[str] = None
    mapping_notes: Optional[List[ConceptualMappingRuleComment]] = None
    editorial_notes: Optional[List[ConceptualMappingRuleComment]] = None
    feedback_notes: Optional[List[ConceptualMappingRuleComment]] = None
    sort_order: Optional[float] = None


class ConceptualMappingRule(BaseProjectResourceEntity, BaseMappingPackagesResourceSchemaTrait, StatefulObjectABC):
    model_config = DEFAULT_MODEL_CONFIG

    status: Optional[CMRuleStatus] | Optional[str] = CMRuleStatus.UNDER_DEVELOPMENT
    mapping_notes: Optional[List[ConceptualMappingRuleComment]] = []
    editorial_notes: Optional[List[ConceptualMappingRuleComment]] = []
    feedback_notes: Optional[List[ConceptualMappingRuleComment]] = []
    mapping_groups: Optional[List[Link[MappingGroup]]] = None

    @field_validator('status', 'mapping_notes', 'editorial_notes', 'feedback_notes')
    @classmethod
    def check_none(cls, current_value: str, info: ValidationInfo) -> str:
        if current_value is None:
            return cls.model_fields[info.field_name].default
        return current_value

    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Optional[Link[StructuralElement]] = None
    xpath_condition: Optional[str] = None
    target_class_path: Optional[str] = None
    target_class_path_terms_validity: Optional[List[TermValidityResponse]] = None
    target_property_path: Optional[str] = None
    target_property_path_terms_validity: Optional[List[TermValidityResponse]] = None
    terms_validity: Optional[ConceptualMappingRuleTermsValidity] | Optional[str] = None
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None
    sort_order: Optional[float] = None

    async def get_state(self) -> ConceptualMappingRuleState:
        source_structural_element = await self.source_structural_element.fetch() \
            if self.source_structural_element else None
        triple_map_fragment = await self.triple_map_fragment.fetch() if self.triple_map_fragment else None
        sparql_assertions_states = []
        if self.sparql_assertions:
            sparql_assertions = [await sparql_assertion.fetch() for sparql_assertion in self.sparql_assertions]
            if sparql_assertions:
                for sparql_assertion in sparql_assertions:
                    sparql_assertion_state = \
                        await sparql_assertion.get_state() \
                        if (sparql_assertion and isinstance(sparql_assertion, SPARQLTestFileResource)) else None
                    if isinstance(sparql_assertion_state, SPARQLTestState):
                        sparql_assertions_states.append(sparql_assertion_state)

        mapping_groups_states = []
        if self.mapping_groups:
            mapping_groups = [await mapping_group.fetch() for mapping_group in self.mapping_groups]
            if mapping_groups:
                mapping_groups_states = [await mapping_group.get_state() for mapping_group in mapping_groups]

        return ConceptualMappingRuleState(
            oid=self.id,
            min_sdk_version=self.min_sdk_version,
            max_sdk_version=self.max_sdk_version,
            source_structural_element=(
                await source_structural_element.get_state()
            ) if (source_structural_element and isinstance(source_structural_element, StructuralElement)) else None,
            xpath_condition=self.xpath_condition,
            target_class_path=self.target_class_path,
            target_property_path=self.target_property_path,
            triple_map_fragment=(
                await triple_map_fragment.get_state()
            ) if (triple_map_fragment and isinstance(triple_map_fragment, GenericTripleMapFragment)) else None,
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
