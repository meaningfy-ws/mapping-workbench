from datetime import datetime
from typing import Optional

from beanie import Document, Link, PydanticObjectId
from dateutil.tz import tzlocal
from pydantic import BaseModel, Field, Extra, ConfigDict, model_validator
from pytz import timezone
from typing_extensions import Self

from mapping_workbench.backend import DEFAULT_TIMEZONE
from mapping_workbench.backend.user.models.user import User


class BaseEntity(Document):
    """
    The general model for entities
    """
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(tzlocal()))
    updated_at: Optional[datetime] = None
    created_by: Optional[Link[User]] = None
    updated_by: Optional[Link[User]] = None
    is_deleted: bool = False

    @model_validator(mode='after')
    def update_model_date_times_with_default_timezone(self) -> Self:
        if self.created_at is not None:
            self.created_at = self.created_at.astimezone(timezone(DEFAULT_TIMEZONE))

        if self.updated_at is not None:
            self.updated_at = self.updated_at.astimezone(timezone(DEFAULT_TIMEZONE))
        return self

    def on_create(self, user: User):
        if user:
            self.created_by = User.link_from_id(user.id)
        if not self.created_at:
            self.created_at = datetime.now(tzlocal())
        return self

    def on_update(self, user: User):
        if user:
            self.updated_by = User.link_from_id(user.id)
        self.updated_at = datetime.now(tzlocal())
        return self

    class Settings:
        validate_on_save = True
        # use_state_management = True


class BaseEntityOutSchema(BaseModel):
    id: Optional[PydanticObjectId] = Field(alias='_id')
    # is_deleted: Optional[bool]
    # created_by: Optional[Any]
    # updated_by: Optional[Any]
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(tzlocal()))
    updated_at: Optional[datetime] = None

    @model_validator(mode='after')
    def update_model_date_times_with_default_timezone(self) -> Self:
        if self.created_at is not None:
            self.created_at = self.created_at.astimezone(timezone(DEFAULT_TIMEZONE))

        if self.updated_at is not None:
            self.updated_at = self.updated_at.astimezone(timezone(DEFAULT_TIMEZONE))
        return self

    model_config = ConfigDict(
        populate_by_name=True
    )


class BaseEntityInSchema(BaseModel, extra=Extra.forbid):
    """
    """


class BaseEntityImmutableFiltersSchema(BaseModel):
    is_deleted: bool = False


class BaseEntityFiltersSchema(BaseEntityImmutableFiltersSchema):
    pass


class BaseEntityListFiltersSchema(BaseEntityFiltersSchema):
    pass


class BaseTitledEntityListFiltersSchema(BaseEntityListFiltersSchema):
    title: Optional[str]
