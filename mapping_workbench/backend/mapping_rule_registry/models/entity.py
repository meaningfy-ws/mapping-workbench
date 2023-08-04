from typing import Optional, List

from beanie import Link, Indexed

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema


class MappingRuleRegistryIn(BaseEntityInSchema):
    pass


class MappingRuleRegistryCreateIn(MappingRuleRegistryIn):
    title: str


class MappingRuleRegistryUpdateIn(MappingRuleRegistryIn):
    title: Optional[str]


class MappingRuleRegistryOut(BaseEntityOutSchema):
    title: Optional[str]
    mapping_rules: Optional[List[Link[ConceptualMappingRule]]]


class MappingRuleRegistry(BaseEntity):
    title: Indexed(str, unique=True)
    mapping_rules: Optional[List[Link[ConceptualMappingRule]]]

    class Settings(BaseEntity.Settings):
        name = "mapping_rule_registries"
