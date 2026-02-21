from datetime import datetime
from enum import Enum
from typing import Optional, List

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity


class ValidationCommentPriority(Enum):
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"


class ValidationReportType(Enum):
    XPATH = "xpath"
    SPARQL = "sparql"
    SHACL = "shacl"


class ValidationReportContext(Enum):
    STATE = "state"
    SUITE = "suite"
    DATA = "data"


class ValidationReportContextEntity(BaseModel):
    id: Optional[PydanticObjectId]
    name: Optional[str]


class ValidationReportContextEntityData(BaseModel):
    report_context: Optional[ValidationReportContext] = None
    context_entity: Optional[ValidationReportContextEntity] = None


class ValidationCommentContext(ValidationReportContextEntityData):
    package_id: Optional[PydanticObjectId] = None
    package_name: Optional[str] = None
    state_id: Optional[PydanticObjectId] = None
    report_type: Optional[ValidationReportType] = None
    parents: Optional[List[ValidationReportContextEntityData]] = None


class ValidationComment(BaseProjectResourceEntity):
    state_id: Optional[PydanticObjectId] = None
    validation_element_id: str
    title: Optional[str] = None
    context: Optional[ValidationCommentContext] = None
    comment: str
    priority: Optional[ValidationCommentPriority] = ValidationCommentPriority.NORMAL
    created_by_username: Optional[str] = None

    class Settings:
        name = "validation_comments"


class ValidationCommentOut(BaseModel):
    id: PydanticObjectId = Field(..., alias='_id')
    title: Optional[str] = None
    comment: str
    state_id: Optional[PydanticObjectId] = None
    context: Optional[ValidationCommentContext] = None
    # created_by: Optional[UserRef] = None
    priority: ValidationCommentPriority
    created_by_username: Optional[str] = None
    created_at: Optional[datetime] = None


class ValidationCommentIn(BaseModel):
    priority: ValidationCommentPriority
    comment: str
    use_in_state: Optional[bool]
    context: Optional[ValidationCommentContext] = None


class ValidationCommentsExistData(BaseModel):
    validation_element_ids: List[str]
