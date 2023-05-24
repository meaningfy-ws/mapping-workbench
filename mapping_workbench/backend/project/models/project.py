from enum import Enum
from typing import Optional, List

from beanie import Link
from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_entity import BaseNamedEntity
from mapping_workbench.backend.mapping_package.models.mapping_package import MappingPackage


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


class Project(BaseNamedEntity):
    title: Optional[str]
    description: Optional[str]
    version: Optional[str]
    source_schema: Optional[SourceSchema]
    target_ontology: Optional[TargetOntology]
    mapping_packages: Optional[List[Link[MappingPackage]]]

    class Settings(BaseNamedEntity.Settings):
        name = "projects"
