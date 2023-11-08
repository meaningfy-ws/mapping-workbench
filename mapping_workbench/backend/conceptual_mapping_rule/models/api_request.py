from typing import Optional

from beanie import PydanticObjectId
from pydantic import BaseModel


class APIRequestForGenerateCMAssertionsQueries(BaseModel):
    project: Optional[PydanticObjectId] = None
    cleanup: Optional[bool] = False
