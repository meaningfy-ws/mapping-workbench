from enum import Enum
from typing import Optional, List

from beanie import Link
from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource
from mapping_workbench.backend.user.models.user import User


class OntologyFileCollection(BaseEntity):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link["OntologyFileResource"]]] = []

    class Settings(BaseEntity.Settings):
        name = "ontology_file_collections"
        use_state_management = True


class OntologyFileCollectionOut(BaseModel):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link["OntologyFileResource"]]] = []
    created_by: Optional[Link[User]]


class OntologyFileResourceFormat(Enum):
    OWL = "OWL"
    RDF = "RDF"


class OntologyFileResource(FileResource):
    format: Optional[OntologyFileResourceFormat]
    ontology_file_collection: Optional[Link[OntologyFileCollection]]

    class Settings(FileResource.Settings):
        name = "ontology_file_resources"
