from enum import Enum
from typing import Optional

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
    content: Optional[str]

    class Settings(BaseEntity.Settings):
        name = "file_resources"
