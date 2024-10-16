from typing import Optional, List, Literal

import pymongo
from beanie import Link
from pydantic import Field, BaseModel
from pymongo import IndexModel

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityOutSchema, BaseProjectResourceEntityInSchema
from mapping_workbench.backend.state_manager.models.state_object import StatefulObjectABC, ObjectState


class StructuralElementLabelOut(BaseModel):
    """
        Output model for CM Rule review page
    """
    id: str = Field(..., alias='_id')
    sdk_element_id: str


class StructuralElementIn(BaseProjectResourceEntityInSchema):
    """
        General input model for Structural Element
    """
    sdk_element_id: Optional[str] = None
    absolute_xpath: Optional[str] = None
    relative_xpath: Optional[str] = None
    parent_node_id: Optional[str] = None
    name: Optional[str] = None
    bt_id: Optional[str] = None


class StructuralElementOut(BaseProjectResourceEntityOutSchema):
    """

    """
    id: str = Field(..., alias='_id')
    sdk_element_id: Optional[str] = None
    absolute_xpath: Optional[str] = None
    relative_xpath: Optional[str] = None
    repeatable: Optional[bool] = None
    parent_node_id: Optional[str] = None
    descriptions: List[str] = []
    versions: List[str] = []
    is_used_in_conceptual_mapping_rules: bool = False
    name: Optional[str] = None
    bt_id: Optional[str] = None
    value_type: Optional[str] = None
    legal_type: Optional[str] = None
    element_type: Literal["node", "field"] = "field"


class StructuralElementState(ObjectState):
    """

    """
    id: str
    sdk_element_id: Optional[str] = None
    absolute_xpath: Optional[str] = None
    relative_xpath: Optional[str] = None
    repeatable: Optional[bool] = None
    parent_node_id: Optional[str] = None
    descriptions: List[str] = []
    versions: List[str] = []
    is_used_in_conceptual_mapping_rules: bool = False
    name: Optional[str] = None
    bt_id: Optional[str] = None
    value_type: Optional[str] = None
    legal_type: Optional[str] = None
    element_type: Literal["node", "field"] = "field"


class StructuralElement(BaseProjectResourceEntity, StatefulObjectABC):
    """

    """
    id: str = None
    sdk_element_id: Optional[str] = None
    absolute_xpath: Optional[str] = None
    relative_xpath: Optional[str] = None
    repeatable: Optional[bool] = None
    parent_node_id: Optional[str] = None
    descriptions: List[str] = []
    versions: List[str] = []
    is_used_in_conceptual_mapping_rules: bool = False
    name: Optional[str] = None
    bt_id: Optional[str] = None
    value_type: Optional[str] = None
    legal_type: Optional[str] = None
    element_type: Literal["node", "field"] = "field"

    async def get_state(self) -> StructuralElementState:
        return StructuralElementState(
            id=self.id,
            sdk_element_id=self.sdk_element_id,
            absolute_xpath=self.absolute_xpath,
            relative_xpath=self.relative_xpath,
            repeatable=self.repeatable,
            parent_node_id=self.parent_node_id,
            descriptions=self.descriptions,
            versions=self.versions,
            is_used_in_conceptual_mapping_rules=self.is_used_in_conceptual_mapping_rules,
            name=self.name,
            bt_id=self.bt_id,
            value_type=self.value_type,
            legal_type=self.legal_type,
            element_type=self.element_type
        )

    def set_state(self, state: StructuralElementState):
        raise Exception("Setting the state of a structural element is not supported.")

    class Settings(BaseProjectResourceEntity.Settings):
        name = "structural_elements_registry"

        indexes = [
            IndexModel(
                [
                    ("sdk_element_id", pymongo.TEXT),
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


class BaseStructuralElementIn(BaseModel):
    """
        General input model for Structural Element
    """
    id: str
    sdk_element_id: str = Field(alias="label")
    absolute_xpath: str
    relative_xpath: Optional[str] = None
    parent_node_id: Optional[str] = None
