from typing import Optional, List

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema


class ConceptualMappingRuleIn(BaseProjectResourceEntityInSchema):
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


class ConceptualMappingRuleOut(BaseProjectResourceEntityOutSchema):
    business_id: Optional[str]
    business_title: Optional[str]
    business_description: Optional[str]
    source_xpath: Optional[List[str]]
    target_class_path: Optional[str]
    target_property_path: Optional[str]


class ConceptualMappingRule(BaseProjectResourceEntity):
    business_id: Optional[str]
    business_title: Optional[str]
    business_description: Optional[str]
    source_xpath: Optional[List[str]]
    target_class_path: Optional[str]
    target_property_path: Optional[str]

    class Settings(BaseProjectResourceEntity.Settings):
        name = "conceptual_mapping_rules"

