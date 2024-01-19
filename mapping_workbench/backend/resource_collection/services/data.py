from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile, ResourceCollection

DEFAULT_RESOURCES_COLLECTION_NAME = "Default"


async def get_resource_files_for_project(project_id: PydanticObjectId) -> \
        List[ResourceFile]:
    items: List[ResourceFile] = await ResourceFile.find(
        ResourceFile.project == Project.link_from_id(project_id)
    ).to_list()

    return items


async def get_default_resource_collection(project_id: PydanticObjectId) -> ResourceCollection:
    project_link = Project.link_from_id(project_id)
    resource_collection: ResourceCollection = await ResourceCollection.find_one(
        ResourceCollection.project == project_link,
        ResourceCollection.title == DEFAULT_RESOURCES_COLLECTION_NAME
    )

    return resource_collection
