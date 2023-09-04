from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn


class ResourceCollection(FileResourceCollection):
    file_resources: Optional[List[Link["ResourceFile"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "resource_collections"


class ResourceFileFormat(Enum):
    CSV = "CSV"
    JSON = "JSON"


class ResourceFileIn(FileResourceIn):
    format: Optional[ResourceFileFormat]


class ResourceFileCreateIn(ResourceFileIn):
    resource_collection: Optional[Link[ResourceCollection]]


class ResourceFileUpdateIn(ResourceFileIn):
    pass


class ResourceFile(FileResource):
    format: Optional[ResourceFileFormat]
    resource_collection: Optional[Link[ResourceCollection]]

    class Settings(FileResource.Settings):
        name = "resource_files"
