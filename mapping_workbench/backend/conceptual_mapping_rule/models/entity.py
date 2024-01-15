from datetime import datetime
from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link, PydanticObjectId
from pydantic import BaseModel
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.ontology.models.term import TermValidityResponse
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment
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
    mapping_group_id: Optional[str] = None
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
    mapping_group_id: Optional[str] = None
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


class ConceptualMappingRuleState(ObjectState):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Optional[StructuralElement] = None
    mapping_group_id: Optional[str] = None
    target_class_path: Optional[str] = None
    target_class_path_terms_validity: Optional[List[TermValidityResponse]] = None
    target_property_path: Optional[str] = None
    target_property_path_terms_validity: Optional[List[TermValidityResponse]] = None
    terms_validity: Optional[ConceptualMappingRuleTermsValidity] = None
    refers_to_mapping_package_ids: Optional[List[PydanticObjectId]] = []
    triple_map_fragment: Optional[GenericTripleMapFragment] = None
    sparql_assertions: Optional[List[SPARQLTestFileResource]] = None
    status: Optional[str] = None
    mapping_notes: Optional[List[ConceptualMappingRuleComment]] = None
    editorial_notes: Optional[List[ConceptualMappingRuleComment]] = None
    feedback_notes: Optional[List[ConceptualMappingRuleComment]] = None


class ConceptualMappingRule(BaseProjectResourceEntity, StatefulObjectABC):
    min_sdk_version: Optional[str] = None
    max_sdk_version: Optional[str] = None
    source_structural_element: Optional[Link[StructuralElement]] = None
    mapping_group_id: Optional[str] = None
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

    async def get_state(self) -> ConceptualMappingRuleState:
        source_structural_element = await self.source_structural_element.fetch()
        triple_map_fragment = await self.triple_map_fragment.fetch() if self.triple_map_fragment else None
        sparql_assertions = []
        if self.sparql_assertions:
            sparql_assertions = [await sparql_assertion.fetch() for sparql_assertion in self.sparql_assertions]

        return ConceptualMappingRuleState(
            source_structural_element=source_structural_element,
            target_class_path=self.target_class_path,
            target_class_path_terms_validity=self.target_class_path_terms_validity,
            target_property_path=self.target_property_path,
            target_property_path_terms_validity=self.target_property_path_terms_validity,
            terms_validity=self.terms_validity,
            refers_to_mapping_package_ids=self.refers_to_mapping_package_ids,
            triple_map_fragment=triple_map_fragment,
            sparql_assertions=sparql_assertions,
            status=self.status,
            mapping_notes=self.mapping_notes,
            editorial_notes=self.editorial_notes,
            feedback_notes=self.feedback_notes
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
