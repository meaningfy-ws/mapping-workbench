from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link
from pydantic import ConfigDict
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn


class ResourceCollection(FileResourceCollection):
    file_resources: Optional[List[Link["ResourceFile"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "resource_collections"

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


class ResourceFileFormat(Enum):
    CSV = "CSV"
    JSON = "JSON"


class ResourceFileIn(FileResourceIn):
    format: Optional[ResourceFileFormat] = None


class ResourceFileCreateIn(ResourceFileIn):
    resource_collection: Optional[Link[ResourceCollection]] = None


class ResourceFileUpdateIn(ResourceFileIn):
    pass


class ResourceFile(FileResource):
    format: Optional[ResourceFileFormat] = None
    resource_collection: Optional[Link[ResourceCollection]] = None

    class Settings(FileResource.Settings):
        name = "resource_files"

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
