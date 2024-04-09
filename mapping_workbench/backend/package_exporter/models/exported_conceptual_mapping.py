from typing import List, Optional

from pydantic import BaseModel

from mapping_workbench.backend import STRICT_MODEL_CONFIG
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage


class EFormsMappingGroup(BaseModel):
    model_config = STRICT_MODEL_CONFIG

    mapping_group_id: str
    instance_type: str
    related_node_id: str
    related_node_xpath: str


class EFormsConceptualMapping(BaseModel):
    model_config = STRICT_MODEL_CONFIG

    mapping_package: MappingPackage
    conceptual_mapping_rules: List[ConceptualMappingRule]
    mapping_groups: List[EFormsMappingGroup]

    comments: Optional[List[str]] = None
    legend: Optional[List[str]] = None
