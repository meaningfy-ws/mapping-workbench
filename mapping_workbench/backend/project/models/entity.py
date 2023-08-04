from enum import Enum
from typing import Optional

from beanie import Indexed
from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema, \
    BaseTitledEntityListFiltersSchema


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


class ProjectIn(BaseEntityInSchema):
    description: Optional[str]
    version: Optional[str]
    source_schema: Optional[SourceSchema]
    target_ontology: Optional[TargetOntology]


class ProjectCreateIn(ProjectIn):
    title: str


class ProjectUpdateIn(ProjectIn):
    title: Optional[str]


class ProjectOut(BaseEntityOutSchema):
    title: Optional[str]
    description: Optional[str]
    version: Optional[str]
    source_schema: Optional[SourceSchema]
    target_ontology: Optional[TargetOntology]


class ProjectListFilters(BaseTitledEntityListFiltersSchema):
    pass


class Project(BaseEntity):
    title: Indexed(str, unique=True)
    description: Optional[str]
    version: Optional[str]
    source_schema: Optional[SourceSchema]
    target_ontology: Optional[TargetOntology]

    class Settings(BaseEntity.Settings):
        name = "projects"
