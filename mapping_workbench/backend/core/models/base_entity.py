from datetime import datetime
from typing import Optional

from beanie import Document, Link

from mapping_workbench.backend.user.models.user import User


class BaseEntity(Document):
    """
    The general model for entities
    """
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
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
        data = self.dict(exclude_unset=True)
        data.pop('id', None)
        return data

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
        use_state_management = True

