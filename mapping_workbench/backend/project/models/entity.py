from enum import Enum
from typing import Optional, List

from beanie import Link, Indexed, PydanticObjectId
from pydantic import BaseModel, Field

from mapping_workbench.backend.core.models.api_entity import ApiEntity, ApiEntityMeta
from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseModelOut
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage


class SourceSchemaType(Enum):
    JSON = "JSON"
    XSD = "XSD"


class SourceSchema(BaseModel):
    title: Optional[str]
    description: Optional[str]
    version: Optional[str]
    type: Optional[SourceSchemaType]

    class Config:
        use_enum_values = True


class TargetOntology(BaseModel):
    title: Optional[str]
    description: Optional[str]
    version: Optional[str]
    uri: Optional[str]


class ProjectIn(BaseModel):
    title: str
    description: Optional[str]
    version: Optional[str]
    source_schema: Optional[SourceSchema]
    target_ontology: Optional[TargetOntology]


class ProjectOut(BaseModelOut):
    title: Optional[str]
    description: Optional[str]
    version: Optional[str]
    source_schema: Optional[SourceSchema]
    target_ontology: Optional[TargetOntology]


class ProjectFilters(BaseModel):
    title: str


class Project(BaseEntity, ApiEntity):
    title: Indexed(str, unique=True)
    description: Optional[str]
    version: Optional[str]
    source_schema: Optional[SourceSchema]
    target_ontology: Optional[TargetOntology]
    mapping_packages: Optional[List[Link[MappingPackage]]]

    class Settings(BaseEntity.Settings):
        name = "projects"

    class ApiSettings(BaseModel):
        model_in = ProjectIn
        model_out = ProjectOut
        model_filters = ProjectFilters
        meta = ApiEntityMeta(
            route_prefix="/projects",
            route_tags=["projects"],
            name_for_one="project",
            name_for_many="projects"
        )
