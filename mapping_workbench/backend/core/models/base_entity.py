from datetime import datetime
from typing import Optional

from beanie import Document, Link, PydanticObjectId
from pydantic import BaseModel, Field, Extra, ConfigDict

from mapping_workbench.backend.user.models.user import User


class BaseEntity(Document):
    """
    The general model for entities
    """
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[Link[User]] = None
    updated_by: Optional[Link[User]] = None
    is_deleted: bool = False

    def on_create(self, user: User):
        self.created_by = User.link_from_id(user.id)
        self.created_at = datetime.now()
        return self

    def on_update(self, user: User):
        self.updated_by = User.link_from_id(user.id)
        self.updated_at = datetime.now()
        return self

    class Settings:
        validate_on_save = True
        # use_state_management = True


class BaseEntityOutSchema(BaseModel):
    id: Optional[PydanticObjectId] = Field(alias='_id')
    # is_deleted: Optional[bool]
    # created_by: Optional[Any]
    # updated_by: Optional[Any]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        populate_by_name=True
    )


class BaseEntityInSchema(BaseModel, extra=Extra.forbid):
    pass


class BaseEntityImmutableFiltersSchema(BaseModel):
    is_deleted: bool = False


class BaseEntityFiltersSchema(BaseEntityImmutableFiltersSchema):
    pass


class BaseEntityListFiltersSchema(BaseEntityFiltersSchema):
    pass


class BaseTitledEntityListFiltersSchema(BaseEntityListFiltersSchema):
    title: Optional[str]
