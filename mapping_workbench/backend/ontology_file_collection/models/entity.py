from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn


class OntologyFileCollection(FileResourceCollection):
    file_resources: Optional[List[Link["OntologyFileResource"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "ontology_file_collections"


class OntologyFileResourceFormat(Enum):
    OWL = "OWL"
    RDF = "RDF"


class OntologyFileResourceIn(FileResourceIn):
    format: Optional[OntologyFileResourceFormat] = None


class OntologyFileResourceCreateIn(OntologyFileResourceIn):
    ontology_file_collection: Optional[Link[OntologyFileCollection]] = None


class OntologyFileResourceUpdateIn(OntologyFileResourceIn):
    pass


class OntologyFileResource(FileResource):
    format: Optional[OntologyFileResourceFormat] = None
    ontology_file_collection: Optional[Link[OntologyFileCollection]] = None

    class Settings(FileResource.Settings):
        name = "ontology_file_resources"
