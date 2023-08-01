from datetime import datetime
from typing import Optional, Dict

from beanie import Document, Link, PydanticObjectId
from pydantic import BaseModel, Field

from mapping_workbench.backend.user.models.user import User


class BaseEntity(Document):
    """
    The general model for entities
    """
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[Link[User]]
    updated_by: Optional[Link[User]]
    is_deleted: bool = False

    # @before_event(Insert)
    # async def set_created_by(self):
    #     self.created_by = await current_active_user()
    #
    # @before_event(Update)
    # async def set_updated_by(self):
    #     self.updated_by = await current_active_user()

    def on_create(self, user: User):
        self.created_by = User.link_from_id(user.id)
        self.created_at = datetime.now()
        return self

    @classmethod
    def on_update_data(cls, data: Dict, user: User) -> Dict:
        data[BaseEntity.updated_by] = User.link_from_id(user.id)
        data.updated_at = datetime.now()
        return data

    class Settings:
        validate_on_save = True
        use_state_management = True


class BaseEntityOutSchema(BaseModel):
    id: Optional[PydanticObjectId] = Field(alias='_id')
    is_deleted: Optional[bool]
    #    created_by: Optional[Any]
    #    updated_by: Optional[Any]
    updated_at: Optional[datetime]

    class Config(BaseModel.Config):
        allow_population_by_field_name = True


class BaseEntityInSchema(BaseModel):
    pass


class BaseEntityImmutableFiltersSchema(BaseModel):
    is_deleted: bool = False


class BaseEntityFiltersSchema(BaseEntityImmutableFiltersSchema):
    pass


class BaseEntityListFiltersSchema(BaseEntityFiltersSchema):
    pass


class BaseTitledEntityListFiltersSchema(BaseEntityListFiltersSchema):
    title: Optional[str]
