from beanie import PydanticObjectId
from pydantic import BaseModel


class JSONEmptyContentWithId(BaseModel):
    id: PydanticObjectId
