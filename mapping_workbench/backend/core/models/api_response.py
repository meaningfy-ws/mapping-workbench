from typing import List

from beanie import PydanticObjectId
from pydantic import BaseModel


class APIEmptyContentWithIdResponse(BaseModel):
    id: PydanticObjectId


class APIListPaginatedResponse(BaseModel):
    items: List
    count: int
