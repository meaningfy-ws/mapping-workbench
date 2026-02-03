from datetime import datetime
from enum import Enum
from typing import Optional, List

from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.user.models.user import UserRef


class ValidationCommentPriority(Enum):
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"


class ValidationComment(BaseProjectResourceEntity):
    state_id: Optional[str] = None
    validation_element_id: str
    title: Optional[str] = None
    comment: str
    priority: Optional[ValidationCommentPriority] = ValidationCommentPriority.NORMAL
    created_by_username: Optional[str] = None

    class Settings:
        name = "validation_comments"


class ValidationCommentOut(BaseModel):
    title: Optional[str] = None
    comment: str
    # created_by: Optional[UserRef] = None
    priority: ValidationCommentPriority
    created_by_username: Optional[str] = None
    created_at: Optional[datetime] = None


class ValidationCommentIn(BaseModel):
    priority: ValidationCommentPriority
    comment: str
    use_in_state: Optional[bool]


class ValidationCommentsExistData(BaseModel):
    validation_element_ids: List[str]
