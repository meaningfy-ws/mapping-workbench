from typing import List, Optional, Union, Literal
from pydantic import BaseModel, Field


class NoticeTypeInfoSelector(BaseModel):
    sub_type_id: str = Field(..., alias="subTypeId")


class NoticeTypesInfoSelector(BaseModel):
    notice_sub_types: List[NoticeTypeInfoSelector] = Field(..., alias="noticeSubTypes")


class NoticeTypeSelector(BaseModel):
    notice_type_id: str = Field(..., alias="noticeId")
    notice_types_info: NoticeTypesInfoSelector = Field(..., alias="noticeTypesInfo")


class NoticeTypeFieldInfoSelector(BaseModel):
    element_id: str = Field(..., alias="id")
    content_type: Literal["field"] = Field(..., alias="contentType")
    description: str = Field(..., alias="description")


class NoticeTypeGroupInfoSelector(BaseModel):
    element_id: str = Field(..., alias="id")
    content_type: Literal["group"] = Field(..., alias="contentType")
    description: str = Field(..., alias="description")
    node_id: Optional[str] = Field(None, alias="nodeId")
    content: List[Union["NoticeTypeGroupInfoSelector", NoticeTypeFieldInfoSelector]]


class NoticeTypeStructureInfoSelector(BaseModel):
    notice_type_id: str = Field(..., alias="noticeId")
    metadata: List[NoticeTypeFieldInfoSelector]
    content: List[NoticeTypeGroupInfoSelector]
