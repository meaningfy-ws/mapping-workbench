from enum import Enum
from typing import Optional, List, Annotated, Any

from beanie import Link
from fastapi import UploadFile, File
from pydantic import validator

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema


class FileResourceFormat(Enum):
    XML = "XML"
    JSON = "JSON"
    RQ = "RQ"
    SHACL_TTL = "SHACL.TTL"
    OWL = "OWL"
    RDF = "RDF"
    CSV = "CSV"


class FileResourceIn(BaseProjectResourceEntityInSchema):
    title: Optional[str]
    description: Optional[str]
    file: Optional[UploadFile]
    filename: Optional[str]
    path: Optional[List[str]]
    format: Optional[FileResourceFormat]
    content: Optional[str]

    @validator("filename", always=True)
    def set_filename(cls, v: str, values: dict[str, Any]) -> str:
        if ("file" in values) and values["file"]:
            return values["file"].filename
        return v

    @validator("content", always=True)
    def set_content(cls, v: str, values: dict[str, Any]) -> str:
        if ("file" in values) and values["file"]:
            return (values["file"].file.read()).decode("utf-8")
        return v


class FileResource(BaseProjectResourceEntity):
    title: Optional[str]
    description: Optional[str]
    filename: Optional[str]
    path: Optional[List[str]]
    format: Optional[FileResourceFormat]
    content: Optional[str]

    class Settings(BaseEntity.Settings):
        name = "file_resources"


class FileResourceCollection(BaseProjectResourceEntity):
    title: Optional[str]
    description: Optional[str]
    path: Optional[List[str]]
    file_resources: Optional[List[Link["FileResource"]]] = []
