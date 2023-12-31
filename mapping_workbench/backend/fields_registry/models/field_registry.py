from beanie import Link
from typing import Optional, List, Literal, Set

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity


class StructuralElement(BaseProjectResourceEntity):
    """

    """
    id: str
    eforms_sdk_element_id: str
    absolute_xpath: str
    relative_xpath: str
    repeatable: bool
    parent_node_id: Optional[str] = None
    descriptions: List[str] = []
    versions: List[str] = []
    is_used_in_conceptual_mapping_rules: bool = False
    name: Optional[str] = None
    bt_id: Optional[str] = None
    value_type: Optional[str] = None
    legal_type: Optional[str] = None
    element_type: Literal["node", "field"] = "field"

    class Settings(BaseProjectResourceEntity.Settings):
        name = "structural_elements_registry"


class StructuralElementsVersionedView(BaseProjectResourceEntity):
    """

    """
    id: str
    eforms_sdk_version: str
    eforms_subtype: str
    ordered_elements: List[Link[StructuralElement]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "structural_elements_versioned_view"


class APIListStructuralElementsPaginatedResponse(APIListPaginatedResponse):
    items: List[StructuralElement]


class APIListStructuralElementsVersionedViewPaginatedResponse(APIListPaginatedResponse):
    items: List[StructuralElementsVersionedView]
