from typing import Optional, List

from mapping_workbench.backend.core.models.base_entity import BaseEntity


class ConceptualMappingRule(BaseEntity):
    business_id: Optional[str]
    business_title: Optional[str]
    business_description: Optional[str]
    source_xpath: Optional[List[str]]
    target_class_path: Optional[str]
    target_property_path: Optional[str]
    refersToMappingPackage: Optional[str]
    refersToTripleMapFragment: Optional[str]

    class Settings(BaseEntity.Settings):
        name = "conceptual_mapping_rules"
