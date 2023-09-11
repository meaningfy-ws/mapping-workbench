from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment


class ConceptualMappingRuleIn(BaseProjectResourceEntityInSchema):
    field_id: Optional[str]
    field_title: Optional[str]
    field_description: Optional[str]
    source_xpath: Optional[List[str]]
    target_class_path: Optional[str]
    target_property_path: Optional[str]
    mapping_packages: Optional[List[Link[MappingPackage]]]
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]]
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]]


class ConceptualMappingRuleCreateIn(ConceptualMappingRuleIn):
    pass


class ConceptualMappingRuleUpdateIn(ConceptualMappingRuleIn):
    pass


class ConceptualMappingRuleOut(BaseProjectResourceEntityOutSchema):
    field_id: Optional[str]
    field_title: Optional[str]
    field_description: Optional[str]
    source_xpath: Optional[List[str]]
    target_class_path: Optional[str]
    target_property_path: Optional[str]
    mapping_packages: Optional[List[Link[MappingPackage]]]
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]]
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]]


class ConceptualMappingRule(BaseProjectResourceEntity):
    field_id: Optional[str]
    field_title: Optional[str]
    field_description: Optional[str]
    source_xpath: Optional[List[str]]
    target_class_path: Optional[str]
    target_property_path: Optional[str]
    mapping_packages: Optional[List[Link[MappingPackage]]]
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]]
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]]

    class Settings(BaseProjectResourceEntity.Settings):
        name = "conceptual_mapping_rules"

