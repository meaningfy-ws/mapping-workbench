from typing import Optional

from beanie import PydanticObjectId
from pydantic import BaseModel


class APIRequestForGenerateCMAssertionsQueries(BaseModel):
    project: Optional[PydanticObjectId] = None
    cleanup: Optional[bool] = False


class APIRequestForGenerateSHACLShapes(BaseModel):
    project_id: PydanticObjectId
    mapping_package_id: Optional[PydanticObjectId] = None
    close_shacl: Optional[bool] = False
