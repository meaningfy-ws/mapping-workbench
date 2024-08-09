from enum import Enum
from typing import Optional, List

from beanie import Link
from fastapi import UploadFile
from pydantic import field_validator
from pydantic_core.core_schema import ValidationInfo

from mapping_workbench.backend.core.models.base_mapping_package_resource_entity import \
    BaseMappingPackageResourceSchemaTrait, BaseMappingPackageResourceEntityInSchema
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectAbleResourceEntity
from mapping_workbench.backend.state_manager.models.state_object import ObjectState


class FileResourceFormat(Enum):
    XML = "XML"
    JSON = "JSON"
    RQ = "RQ"
    SHACL_TTL = "SHACL.TTL"
    OWL = "OWL"
    RDF = "RDF"
    CSV = "CSV"


class FileResourceIn(
    BaseProjectResourceEntityInSchema,
    BaseMappingPackageResourceEntityInSchema
):
    title: Optional[str] = None
    description: Optional[str] = None
    file: Optional[UploadFile] = None
    filename: Optional[str] = None
    path: Optional[List[str]] = None
    format: Optional[FileResourceFormat] = None
    content: Optional[str] = None

    @field_validator("filename")
    def set_filename(cls, v: str, values: ValidationInfo) -> str:
        data = values.data
        if ("file" in data) and data["file"]:
            return data["file"].filename
        return v

    @field_validator("content")
    def set_content(cls, v: str, values: ValidationInfo) -> str:
        data = values.data
        if ("file" in data) and data["file"]:
            return (data["file"].file.read()).decode("utf-8")
        return v


class FileResource(
    BaseProjectAbleResourceEntity,
    BaseMappingPackageResourceSchemaTrait
):
    title: Optional[str] = None
    description: Optional[str] = None
    filename: Optional[str] = None
    path: Optional[List[str]] = None
    format: Optional[FileResourceFormat] = None
    content: Optional[str] = None


class FileResourceCollection(
    BaseProjectResourceEntity,
    BaseMappingPackageResourceSchemaTrait
):
    title: Optional[str] = None
    description: Optional[str] = None
    path: Optional[List[str]] = None
    file_resources: Optional[List[Link["FileResource"]]] = []


class FileResourceState(ObjectState):
    title: Optional[str] = None
    description: Optional[str] = None
    filename: Optional[str] = None
    path: Optional[List[str]] = None
    format: Optional[FileResourceFormat] = None
    content: Optional[str] = None
