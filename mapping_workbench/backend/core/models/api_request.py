from beanie import PydanticObjectId
from pydantic import BaseModel


class APIRequestWithId(BaseModel):
    id: PydanticObjectId
