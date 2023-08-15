from typing import Optional, List

from beanie import Link, Indexed

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema


class MappingRuleRegistryIn(BaseProjectResourceEntityInSchema):
    pass


class MappingRuleRegistryCreateIn(MappingRuleRegistryIn):
    title: str


class MappingRuleRegistryUpdateIn(MappingRuleRegistryIn):
    title: Optional[str]


class MappingRuleRegistryOut(BaseProjectResourceEntityOutSchema):
    title: Optional[str]
    mapping_rules: Optional[List[Link[ConceptualMappingRule]]]


class MappingRuleRegistry(BaseProjectResourceEntity):
    title: Indexed(str, unique=True)
    mapping_rules: Optional[List[Link[ConceptualMappingRule]]]

    class Settings(BaseProjectResourceEntity.Settings):
        name = "mapping_rule_registries"
