from datetime import datetime
from enum import Enum
from typing import Optional

from beanie import Link, Document
from dateutil.tz import tzlocal
from pydantic import BaseModel, Field

from mapping_workbench.backend.user.models.user import User, UserRef


class ValidationCommentPriority(Enum):
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"


class ValidationComment(Document):
    project_id: str
    state_id: str
    validation_element_id: str
    title: Optional[str] = None
    comment: Optional[str] = None
    priority: Optional[ValidationCommentPriority] | Optional[str] = ValidationCommentPriority.NORMAL
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(tzlocal()))
    created_by: Optional[Link[User]] = None
    updated_at: Optional[datetime] = None
    updated_by: Optional[Link[User]] = None


class ValidationCommentOut(BaseModel):
    comment: str
    created_by: Optional[UserRef]


class ValidationCommentIn(BaseModel):
    comment: str
