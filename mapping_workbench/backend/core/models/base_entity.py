from datetime import datetime
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel, Field
from pydantic.json import ENCODERS_BY_TYPE


class PydanticObjectId(ObjectId):
    """
    Object Id field. Compatible with Pydantic.
    """

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, bytes):
            v = v.decode("utf-8")
        try:
            return PydanticObjectId(v)
        except InvalidId:
            raise TypeError("Id must be of type PydanticObjectId")

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(
            type="string",
            examples=["5eb7cf5a86d9755df3a6c593", "5eb7cfb05e32e07750a1756a"],
        )


ENCODERS_BY_TYPE[
    PydanticObjectId
] = str


class BaseEntity(BaseModel):
    """
    The general model for entities
    """
    id: Optional[PydanticObjectId] = Field(default_factory=PydanticObjectId)

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
        json_encoders = {
            ObjectId: lambda v: str(v)
        }
        fields = {
            "id": "_id"
        }

