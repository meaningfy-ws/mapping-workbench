from datetime import datetime
from enum import Enum
from typing import Optional, List, Literal

import pymongo
from beanie import Link
from pydantic import BaseModel
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralField
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.ontology.models.term import TermValidityResponse
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment
from mapping_workbench.backend.user.models.user import User


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
    field_id: Optional[str] = None
    field_title: Optional[str] = None
    field_description: Optional[str] = None
    source_xpath: Optional[List[str]] = None
    target_class_path: Optional[str] = None
    target_property_path: Optional[str] = None
    mapping_packages: Optional[List[Link[MappingPackage]]] = None
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None
    notes: Optional[List[ConceptualMappingRuleComment]] = None
    comments: Optional[List[ConceptualMappingRuleComment]] = None


class ConceptualMappingRuleCreateIn(ConceptualMappingRuleIn):
    pass


class ConceptualMappingRuleUpdateIn(ConceptualMappingRuleIn):
    pass


class ConceptualMappingRuleOut(BaseProjectResourceEntityOutSchema):
    field_id: Optional[str] = None
    field_title: Optional[str] = None
    field_description: Optional[str] = None
    source_xpath: Optional[List[str]] = None
    target_class_path: Optional[str] = None
    target_class_path_terms_validity: Optional[List[TermValidityResponse]] = None
    target_property_path: Optional[str] = None
    target_property_path_terms_validity: Optional[List[TermValidityResponse]] = None
    terms_validity: Optional[ConceptualMappingRuleTermsValidity] = None
    mapping_packages: Optional[List[Link[MappingPackage]]] = None
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None
    notes: Optional[List[ConceptualMappingRuleComment]] = None
    comments: Optional[List[ConceptualMappingRuleComment]] = None
    refers_to_eforms_sdk_versions: Optional[List[str]] = None
    refers_to_structural_element_id: Optional[str] = None
    refers_to_content_type: Literal["field", "node"] = "field"


class ConceptualMappingRule(BaseProjectResourceEntity):
    field_id: Optional[str] = None
    field_title: Optional[str] = None
    field_description: Optional[str] = None
    source_xpath: Optional[List[str]] = None
    target_class_path: Optional[str] = None
    target_class_path_terms_validity: Optional[List[TermValidityResponse]] = None
    target_property_path: Optional[str] = None
    target_property_path_terms_validity: Optional[List[TermValidityResponse]] = None
    terms_validity: Optional[ConceptualMappingRuleTermsValidity] = None
    mapping_packages: Optional[List[Optional[Link[MappingPackage]]]] = None
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None
    notes: Optional[List[ConceptualMappingRuleComment]] = None
    comments: Optional[List[ConceptualMappingRuleComment]] = None
    refers_to_eforms_sdk_versions: Optional[List[str]] = None
    refers_to_structural_element_id: Optional[str] = None
    refers_to_content_type: Literal["field", "node"] = "field"

    class Settings(BaseProjectResourceEntity.Settings):
        name = "conceptual_mapping_rules"
        indexes = [
            IndexModel(
                [
                    ("field_id", pymongo.TEXT),
                    ("field_title", pymongo.TEXT),
                    ("field_description", pymongo.TEXT),
                    ("source_xpath", pymongo.TEXT),
                    ("target_class_path", pymongo.TEXT),
                    ("target_property_path", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]
