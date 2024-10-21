from typing import List, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel


class APIEmptyContentResponse(BaseModel):
    pass


class APIEmptyContentWithIdResponse(BaseModel):
    id: PydanticObjectId


class APIEmptyContentWithStrIdResponse(BaseModel):
    id: str


class APIListPaginatedResponse(BaseModel):
    items: List
    count: int


class AppSettingsResponse(BaseModel):
    version: Optional[str] = None
