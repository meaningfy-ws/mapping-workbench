from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_mapping_package_resource_entity import \
    BaseMappingPackagesResourceSchemaTrait
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC


class ResourceFileFormat(Enum):
    CSV = "CSV"
    JSON = "JSON"


class ResourceFileState(ObjectState):
    format: Optional[ResourceFileFormat] = None
    title: Optional[str] = None
    description: Optional[str] = None
    filename: Optional[str] = None
    path: Optional[List[str]] = None
    content: Optional[str] = None


class ResourceCollectionState(ObjectState):
    title: Optional[str] = None
    description: Optional[str] = None
    file_resources: Optional[List[ResourceFileState]] = []


class ResourceCollection(FileResourceCollection, BaseMappingPackagesResourceSchemaTrait, StatefulObjectABC):
    file_resources: Optional[List[Link["ResourceFile"]]] = []

    async def get_resource_files_states(self) -> List[ResourceFileState]:
        resource_files = await ResourceFile.find(
            ResourceFile.resource_collection == ResourceCollection.link_from_id(self.id),
            ResourceFile.project == self.project
        ).to_list()

        resource_files_states = [await resource_file.get_state() for resource_file in
                                 resource_files] if resource_files else []

        return resource_files_states

    async def get_state(self) -> ResourceCollectionState:
        return ResourceCollectionState(
            title=self.title,
            description=self.description,
            format=self.format,
            file_resources=self.get_resource_files_states()
        )

    def set_state(self, state: ResourceCollectionState):
        raise Exception("Setting the state of a Resource Collection is not supported.")

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


class ResourceFileIn(FileResourceIn):
    format: Optional[ResourceFileFormat] = None


class ResourceFileCreateIn(ResourceFileIn):
    resource_collection: Optional[Link[ResourceCollection]] = None


class ResourceFileUpdateIn(ResourceFileIn):
    pass


class ResourceFile(FileResource, StatefulObjectABC):
    format: Optional[ResourceFileFormat] = None
    resource_collection: Optional[Link[ResourceCollection]] = None

    async def get_state(self) -> ResourceFileState:
        return ResourceFileState(
            format=self.format,
            title=self.title,
            description=self.description,
            filename=self.filename,
            path=self.path,
            content=self.content
        )

    def set_state(self, state: ResourceFileState):
        raise Exception("Setting the state of a Resource File is not supported.")

    def guess_name(self) -> str:
        return self.filename or self.title or str(self.id)

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
