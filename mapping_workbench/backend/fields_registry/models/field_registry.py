import pymongo
from beanie import Link
from typing import Optional, List, Literal, Set

from pymongo import IndexModel

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity


class StructuralElement(BaseProjectResourceEntity):
    """

    """
    id: str
    eforms_sdk_element_id: str = None
    absolute_xpath: str = None
    relative_xpath: str = None
    repeatable: bool = None
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

        indexes = [
            IndexModel(
                [
                    ("eforms_sdk_element_id", pymongo.TEXT),
                    ("absolute_xpath", pymongo.TEXT),
                    ("relative_xpath", pymongo.TEXT),
                    ("parent_node_id", pymongo.TEXT),
                    ("versions", pymongo.TEXT),
                    ("name", pymongo.TEXT),
                    ("bt_id", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]


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
