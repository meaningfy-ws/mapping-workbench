from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile


async def get_resource_files_for_project(project_id: PydanticObjectId) -> \
        List[ResourceFile]:
    items: List[ResourceFile] = await ResourceFile.find(
        ResourceFile.project == Project.link_from_id(project_id)
    ).to_list()

    return items
