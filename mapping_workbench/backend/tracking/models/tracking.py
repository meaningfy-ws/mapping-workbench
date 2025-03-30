from datetime import datetime
from enum import Enum
from typing import Optional

from beanie import PydanticObjectId, Document
from dateutil.tz import tzlocal
from pydantic import BaseModel, Field


class EntityType(Enum):
    PACKAGE = "package"
    USER = "user"


class ActivityType(Enum):
    LOGIN = "login"
    LOGOUT = "logout"
    PROCESS = "process"
    CREATE = "create"
    UPDATE = "update"


class ActivityMedata(BaseModel):
    entity_type: EntityType
    entity_id: Optional[str] = None
    entity_name: Optional[str] = None


class TrackedUserLink(BaseModel):
    user_id: PydanticObjectId
    email: Optional[str] = None


class TrackedUser(Document):
    user_id: PydanticObjectId
    email: Optional[str] = None
    name: Optional[str] = None
    metadata: Optional[dict] = None
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(tzlocal()))

    class Settings:
        name = "tracked_users"


class TrackedActivity(Document):
    activity: ActivityType
    user: Optional[TrackedUserLink] = None
    metadata: Optional[ActivityMedata] = None
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(tzlocal()))

    class Settings:
        name = "tracked_activities"
