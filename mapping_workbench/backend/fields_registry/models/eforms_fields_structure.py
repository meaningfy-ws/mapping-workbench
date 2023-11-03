from typing import List, Optional
from pydantic import BaseModel, Field


class EFormsFieldsRepeatableAttribute(BaseModel):
    value: bool
    severity: str


class EFormsField(BaseModel):
    id: str
    parent_node_id: str = Field(..., alias='parentNodeId')
    name: str
    xpath_absolute: str = Field(..., alias='xpathAbsolute')
    xpath_relative: str = Field(..., alias='xpathRelative')
    value_type: str = Field(..., alias='type')
    legal_type: Optional[str] = Field(default=None, alias='legalType')
    repeatable: EFormsFieldsRepeatableAttribute


class EFormsNode(BaseModel):
    id: str
    parent_id: Optional[str] = Field(default=None, alias='parentId')
    xpath_absolute: str = Field(..., alias='xpathAbsolute')
    xpath_relative: str = Field(..., alias='xpathRelative')
    repeatable: bool


class EFormsSDKFields(BaseModel):
    ubl_version: str = Field(..., alias='ublVersion')
    sdk_version: str = Field(..., alias='sdkVersion')
    xml_structure: List[EFormsNode] = Field(..., alias='xmlStructure')
    fields: List[EFormsField]
