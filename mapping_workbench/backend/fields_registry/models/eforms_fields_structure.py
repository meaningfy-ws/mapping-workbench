import hashlib
from typing import List, Optional

from pydantic import BaseModel, Field


class EFormsFieldsRepeatableAttribute(BaseModel):
    value: bool
    severity: str


class EFormsFieldsPrivacyAttribute(BaseModel):
    code: str
    unpublished_field_id: str = Field(default=None, alias='unpublishedFieldId')
    reason_code_field_id: str = Field(default=None, alias='reasonCodeFieldId')
    reason_description_field_id: str = Field(default=None, alias='reasonDescriptionFieldId')
    publication_date_field_id: str = Field(default=None, alias='publicationDateFieldId')


class EFormsFieldsCodeListValueAttribute(BaseModel):
    id: str


class EFormsFieldsCodeListAttribute(BaseModel):
    value: EFormsFieldsCodeListValueAttribute = Field(default=None, alias='value')


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
    privacy: EFormsFieldsPrivacyAttribute = Field(default=None, alias='privacy')
    code_list: EFormsFieldsCodeListAttribute = Field(default=None, alias='codeList')
    attributes: Optional[List[str]] = Field(default=None, alias='attributes')

    def generate_hash_id(self, project_id: str = None, sdk_version: str = None) -> str:
        fields_to_hash = [project_id, sdk_version, self.id, self.xpath_absolute, self.xpath_relative,
                          self.repeatable.value,
                          self.parent_node_id, self.name, self.bt_id, self.value_type,
                          self.legal_type,
                          self.privacy.code if self.privacy else None,
                          self.code_list.value.id if self.code_list and self.code_list.value else None
                          ]
        str_content = "_".join(map(str, fields_to_hash))
        return str(hashlib.sha1(str_content.encode("utf-8")).hexdigest())


def generate_project_eforms_field_hash_id(
        sdk_element_id: str,
        repeatable: bool,
        parent_node_id: Optional[str] = None,
        absolute_xpath: str = None,
        relative_xpath: str = None,
        value_type: str = None,
        legal_type: str = None,
        privacy_code: str = None,
        code_list_value_id: str = None,
        project_id: str = None
):
    fields_to_hash = [project_id, sdk_element_id, absolute_xpath, relative_xpath, repeatable, parent_node_id,
                      value_type, legal_type, privacy_code, code_list_value_id]
    str_content = "_".join(map(str, fields_to_hash))
    return str(hashlib.sha1(str_content.encode("utf-8")).hexdigest())


def generate_eforms_node_hash_id(
        id: str,
        repeatable: bool,
        parent_id: Optional[str] = None,
        xpath_absolute: str = None,
        xpath_relative: str = None,
        project_id: str = None,
        sdk_version: str = None
):
    fields_to_hash = [project_id, sdk_version, id, xpath_absolute, xpath_relative, repeatable, parent_id]
    str_content = "_".join(map(str, fields_to_hash))
    return str(hashlib.sha1(str_content.encode("utf-8")).hexdigest())


class EFormsNode(BaseModel):
    id: str
    parent_id: Optional[str] = Field(default=None, alias='parentId')
    xpath_absolute: str = Field(..., alias='xpathAbsolute')
    xpath_relative: str = Field(..., alias='xpathRelative')
    repeatable: bool

    def generate_hash_id(self, project_id: str = None, sdk_version: str = None):
        return generate_eforms_node_hash_id(
            id=self.id,
            repeatable=self.repeatable,
            parent_id=self.parent_id,
            xpath_absolute=self.xpath_absolute,
            xpath_relative=self.xpath_relative,
            project_id=project_id,
            sdk_version=sdk_version
        )


class EFormsSDKFields(BaseModel):
    ubl_version: str = Field(..., alias='ublVersion')
    sdk_version: str = Field(..., alias='sdkVersion')
    xml_structure: List[EFormsNode] = Field(..., alias='xmlStructure')
    fields: List[EFormsField]


class EFormsSDKNoticeType(BaseModel):
    ubl_version: str = Field(..., alias='ublVersion')
    sdk_version: str = Field(..., alias='sdkVersion')
    notice_id: str = Field(..., alias='noticeId')
