from datetime import datetime
from typing import Optional, Dict

from beanie import Document, Link, Indexed

from mapping_workbench.backend.user.models.user import User


class BaseEntity(Document):
    """
    The general model for entities
    """
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    created_by: Optional[Link[User]]
    updated_by: Optional[Link[User]]

    # @before_event(Insert)
    # async def set_created_by(self):
    #     self.created_by = await current_active_user()
    #
    # @before_event(Update)
    # async def set_updated_by(self):
    #     self.updated_by = await current_active_user()

    @classmethod
    def get_field_names(cls, alias=False):
        return list(cls.schema(alias).get("properties").keys())

    def dict_for_update(self) -> dict:
        return self.dict(exclude_unset=True)

    def on_create(self, user: User):
        self.created_by = User.link_from_id(user.id)
        return self

    def on_update(self, user: User):
        self.updated_by = User.link_from_id(user.id)
        return self

    class Settings:
        validate_on_save = True


class BaseNamedEntity(BaseEntity):
    name: Indexed(str, unique=True)

    class Settings(BaseEntity.Settings):
        ...
