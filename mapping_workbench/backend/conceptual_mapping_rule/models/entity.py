from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment


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
    target_property_path: Optional[str] = None
    mapping_packages: Optional[List[Link[MappingPackage]]] = None
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None


class ConceptualMappingRule(BaseProjectResourceEntity):
    field_id: Optional[str] = None
    field_title: Optional[str] = None
    field_description: Optional[str] = None
    source_xpath: Optional[List[str]] = None
    target_class_path: Optional[str] = None
    target_property_path: Optional[str] = None
    mapping_packages: Optional[List[Link[MappingPackage]]] = None
    triple_map_fragment: Optional[Link[GenericTripleMapFragment]] = None
    sparql_assertions: Optional[List[Link[SPARQLTestFileResource]]] = None

    class Settings(BaseProjectResourceEntity.Settings):
        name = "conceptual_mapping_rules"

