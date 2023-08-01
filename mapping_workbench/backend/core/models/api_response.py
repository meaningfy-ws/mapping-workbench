from typing import List

from beanie import PydanticObjectId
from pydantic import BaseModel, Field


class JSONEmptyContentWithId(BaseModel):
    id: PydanticObjectId


class JSONPagedReponse(BaseModel):
    items: List
    count: int

    def __dict__(self):
        return self.to_dict()

    def to_dict(self):
        return {"items": self.items, "count": self.count}
