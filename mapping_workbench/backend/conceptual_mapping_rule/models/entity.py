from typing import Optional, List

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema


class ConceptualMappingRuleIn(BaseEntityInSchema):
    business_id: Optional[str]
    business_title: Optional[str]
    business_description: Optional[str]
    source_xpath: Optional[List[str]]
    target_class_path: Optional[str]
    target_property_path: Optional[str]


class ConceptualMappingRuleCreateIn(ConceptualMappingRuleIn):
    pass


class ConceptualMappingRuleUpdateIn(ConceptualMappingRuleIn):
    pass


class ConceptualMappingRuleOut(BaseEntityOutSchema):
    business_id: Optional[str]
    business_title: Optional[str]
    business_description: Optional[str]
    source_xpath: Optional[List[str]]
    target_class_path: Optional[str]
    target_property_path: Optional[str]


class ConceptualMappingRule(BaseEntity):
    business_id: Optional[str]
    business_title: Optional[str]
    business_description: Optional[str]
    source_xpath: Optional[List[str]]
    target_class_path: Optional[str]
    target_property_path: Optional[str]

    class Settings(BaseEntity.Settings):
        name = "conceptual_mapping_rules"

