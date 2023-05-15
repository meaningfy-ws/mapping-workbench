from datetime import datetime
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, Field


class ObjectIdField:
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value):
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid Id")

        return ObjectId(value)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class BaseEntity(BaseModel):
    """
    The general model for entities
    """
    # id: Optional[ObjectIdField]
    created_at: datetime = datetime.now().replace(microsecond=0).isoformat()
    updated_at: datetime = datetime.now().replace(microsecond=0).isoformat()

    __settings__ = None

    @property
    def settings(self):
        if self.__settings__ is None:
            self.__settings__ = self.Settings()
        return self.__settings__

    def dict(self, **kwargs):
        return super().dict(exclude_none=self.settings.exclude_none_from_dict, **kwargs)

    # extra settings
    class Settings:
        # collection name of the entity
        table_name = None
        exclude_none_from_dict = False

    class Config:
        # pydantic properties
        validate_assignment = True
        # orm_mode = True
        allow_population_by_field_name = True
        underscore_attrs_are_private = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
