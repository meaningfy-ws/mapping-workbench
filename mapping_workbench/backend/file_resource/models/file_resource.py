from enum import Enum
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from mapping_workbench.backend.core.models.base_entity import BaseEntity


class FileResourceFormat(Enum):
    XML = "XML"
    JSON = "JSON"
    RQ = "RQ"
    SHACL_TTL = "SHACL.TTL"
    OWL = "OWL"
    RDF = "RDF"
    CSV = "CSV"


class FileResource(BaseEntity):
    title: Optional[str]
    description: Optional[str]
    filename: Optional[str]
    format: Optional[FileResourceFormat]
    _content: Optional[str]

    def content(self):
        self._content = AsyncIOMotorGridFSBucket(self._database, root_collection)

    class Settings(BaseEntity.Settings):
        name = "file_resources"
