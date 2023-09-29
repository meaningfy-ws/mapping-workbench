from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn


class OntologyFileCollection(FileResourceCollection):
    file_resources: Optional[List[Link["OntologyFileResource"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "ontology_file_collections"

        indexes = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("path", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]


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

        indexes = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("filename", pymongo.TEXT),
                    ("path", pymongo.TEXT),
                    ("format", pymongo.TEXT),
                    ("content", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]
