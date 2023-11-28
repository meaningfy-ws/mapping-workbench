from beanie import Link
from pydantic import BaseModel
from typing import Optional, List

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
    description: Optional[str] = None
    versions: List[str] = []
    is_used_in_conceptual_mapping_rules: bool = False


class StructuralField(StructuralElement):
    """

    """
    name: str
    bt_id: str
    value_type: Optional[str] = None
    legal_type: Optional[str] = None

    class Settings(BaseProjectResourceEntity.Settings):
        name = "fields_registry"


class StructuralNode(StructuralElement):
    """

    """

    class Settings(BaseProjectResourceEntity.Settings):
        name = "nodes_registry"


class StructuralElementsOrder(BaseModel):
    """

    """
    node: Optional[Link[StructuralNode]] = None
    field: Optional[Link[StructuralField]] = None


class StructuralElementsVersionedView(BaseProjectResourceEntity):
    """

    """
    id: str
    eforms_sdk_version: str
    eforms_subtype: str
    ordered_elements: List[StructuralElementsOrder] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "structural_elements_versioned_view"


class APIListStructuralFieldPaginatedResponse(APIListPaginatedResponse):
    items: List[StructuralField]


class APIListStructuralNodePaginatedResponse(APIListPaginatedResponse):
    items: List[StructuralNode]


class APIListStructuralElementsVersionedViewPaginatedResponse(APIListPaginatedResponse):
    items: List[StructuralElementsVersionedView]
