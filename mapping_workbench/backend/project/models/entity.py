from enum import Enum
from typing import Optional, List

from beanie import Link, Indexed
from pydantic import BaseModel

from mapping_workbench.backend.core.models.api_entity import ApiEntity, ApiEntityMeta, ApiEntitySettings
from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema, \
    BaseTitledEntityListFiltersSchema
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


class Project(BaseEntity, ApiEntity):
    title: Indexed(str, unique=True)
    description: Optional[str]
    version: Optional[str]
    source_schema: Optional[SourceSchema]
    target_ontology: Optional[TargetOntology]
    mapping_packages: Optional[List[Link[MappingPackage]]]

    class Settings(BaseEntity.Settings):
        name = "projects"
        use_state_management = True

    class ApiSettings(ApiEntitySettings):
        model_create_in: type[BaseModel] = ProjectCreateIn
        model_update_in: type[BaseModel] = ProjectUpdateIn
        model_out: type[BaseModel] = ProjectOut
        model_list_filters: type[BaseModel] = ProjectListFilters
        meta: ApiEntityMeta = ApiEntityMeta(
            route_prefix="/projects",
            route_tags=["projects"],
            name_for_one="project",
            name_for_many="projects"
        )
