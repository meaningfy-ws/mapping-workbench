from typing import Dict, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel


class APIRequestWithId(BaseModel):
    id: PydanticObjectId


class APIRequestForUpdateMany(BaseModel):
    for_query: Optional[Dict]
    set_values: Optional[Dict]


class APIRequestWithProject(BaseModel):
    project: Optional[PydanticObjectId] = None


class APIRequestWithProjectAndContent(BaseModel):
    project: Optional[PydanticObjectId] = None
    content: Optional[str] = None
