from enum import Enum
from typing import Optional

import pymongo
from beanie import Indexed
from pydantic import BaseModel, ConfigDict
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema, \
    BaseTitledEntityListFiltersSchema


class ProjectNotFoundException(Exception):
    pass


class SourceSchemaType(Enum):
    JSON = "JSON"
    XSD = "XSD"


class SourceSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    type: Optional[SourceSchemaType] = None

    model_config = ConfigDict(
        use_enum_values=True
    )


class TargetOntology(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    uri: Optional[str] = None


class ProjectIn(BaseEntityInSchema):
    description: Optional[str] = None
    version: Optional[str] = None
    source_schema: Optional[SourceSchema] = None
    target_ontology: Optional[TargetOntology] = None


class ProjectCreateIn(ProjectIn):
    title: str


class ProjectUpdateIn(ProjectIn):
    title: Optional[str] = None


class ProjectOut(BaseEntityOutSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    source_schema: Optional[SourceSchema] = None
    target_ontology: Optional[TargetOntology] = None


class ProjectListFilters(BaseTitledEntityListFiltersSchema):
    pass


class Project(BaseEntity):
    title: Optional[Indexed(str, unique=True)] = None
    description: Optional[str] = None
    version: Optional[str] = None
    source_schema: Optional[SourceSchema] = None
    target_ontology: Optional[TargetOntology] = None

    class Settings(BaseEntity.Settings):
        name = "projects"

        indexes = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("version", pymongo.TEXT),
                    ("source_schema", pymongo.TEXT),
                    ("target_ontology", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]
