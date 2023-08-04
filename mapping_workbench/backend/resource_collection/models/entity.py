from enum import Enum
from typing import Optional, List

from beanie import Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource


class ResourceCollection(BaseEntity):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link["ResourceFile"]]] = []

    class Settings(BaseEntity.Settings):
        name = "resource_collections"
        use_state_management = True


class ResourceFileFormat(Enum):
    CSV = "CSV"
    JSON = "JSON"


class ResourceFile(FileResource):
    format: Optional[ResourceFileFormat]
    resource_collection: Optional[Link[ResourceCollection]]

    class Settings(FileResource.Settings):
        name = "resource_files"
