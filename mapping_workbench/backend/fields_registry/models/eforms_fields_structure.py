import hashlib
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
    bt_id: Optional[str] = Field(default=None, alias='btId')
    legal_type: Optional[str] = Field(default=None, alias='legalType')
    repeatable: EFormsFieldsRepeatableAttribute

    def generate_hash_id(self) -> str:
        fields_to_hash = [self.id, self.xpath_absolute, self.xpath_relative, self.repeatable.value,
                          self.parent_node_id, self.name, self.bt_id, self.value_type,
                          self.legal_type]
        str_content = "_".join(map(str, fields_to_hash))
        return str(hashlib.sha1(str_content.encode("utf-8")).hexdigest())


class EFormsNode(BaseModel):
    id: str
    parent_id: Optional[str] = Field(default=None, alias='parentId')
    xpath_absolute: str = Field(..., alias='xpathAbsolute')
    xpath_relative: str = Field(..., alias='xpathRelative')
    repeatable: bool

    def generate_hash_id(self):
        fields_to_hash = [self.id, self.xpath_absolute, self.xpath_relative, self.repeatable,
                          self.parent_id]
        str_content = "_".join(map(str, fields_to_hash))
        return str(hashlib.sha1(str_content.encode("utf-8")).hexdigest())


class EFormsSDKFields(BaseModel):
    ubl_version: str = Field(..., alias='ublVersion')
    sdk_version: str = Field(..., alias='sdkVersion')
    xml_structure: List[EFormsNode] = Field(..., alias='xmlStructure')
    fields: List[EFormsField]


class EFormsSDKNoticeType(BaseModel):
    ubl_version: str = Field(..., alias='ublVersion')
    sdk_version: str = Field(..., alias='sdkVersion')
    notice_id: str = Field(..., alias='noticeId')
