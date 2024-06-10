from typing import List

from beanie import PydanticObjectId
from pydantic import BaseModel


class APIEmptyContentResponse(BaseModel):
    pass


class APIEmptyContentWithIdResponse(BaseModel):
    id: PydanticObjectId


class APIListPaginatedResponse(BaseModel):
    items: List
    count: int
