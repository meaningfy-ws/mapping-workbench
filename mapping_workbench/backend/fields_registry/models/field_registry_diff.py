from typing import List, Optional

from pydantic import BaseModel

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement


class BoolValeDiff(BaseModel):
    old_value: Optional[bool]
    new_value: Optional[bool]


class StringValeDiff(BaseModel):
    old_value: Optional[str]
    new_value: Optional[str]


class UpdatedStructuralElementDiff(BaseModel):
    absolute_xpath: Optional[StringValeDiff] = None
    relative_xpath: Optional[StringValeDiff] = None
    repeatable: Optional[BoolValeDiff] = None
    parent_node_id: Optional[StringValeDiff] = None
    description: Optional[StringValeDiff] = None
    imported: Optional[BoolValeDiff] = None


class UpdatedStructuralFieldDiff(UpdatedStructuralElementDiff):
    name: Optional[StringValeDiff] = None
    bt_id: Optional[StringValeDiff] = None
    value_type: Optional[StringValeDiff] = None
    legal_type: Optional[StringValeDiff] = None


class UpdatedStructuralNodeDiff(UpdatedStructuralElementDiff):
    """

    """


class FieldsRegistryDiff(BaseModel):
    deleted_fields: List[StructuralElement] = []
    new_fields: List[StructuralElement] = []
    updated_fields: List[UpdatedStructuralFieldDiff] = []
    deleted_nodes: List[StructuralElement] = []
    new_nodes: List[StructuralElement] = []
    updated_nodes: List[UpdatedStructuralNodeDiff] = []
    updated_title: Optional[str] = None
    updated_root_node_id: Optional[str] = None
