from typing import List

from beanie import PydanticObjectId
from pydantic import BaseModel


class APIEmptyContentWithIdResponse(BaseModel):
    id: PydanticObjectId

    class Config:
        underscore_attrs_are_private = False
        fields = {'id': '_id'}


class APIListPaginatedResponse(BaseModel):
    items: List
    count: int
