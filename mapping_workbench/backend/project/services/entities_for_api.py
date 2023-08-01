from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User


async def list_projects() -> List[Project]:
    return await Project.find(fetch_links=False).to_list()


async def create_project(project: Project, user: User) -> Project:
    project.on_create(user=user)
    return await project.create()


async def update_project(id: PydanticObjectId, data: Dict, user: User):
    project: Project = await Project.get(id)
    if not project:
        raise ResourceNotFoundException()
    update_data = Project(**data).on_update(user=user).dict_for_update()
    return await project.set(update_data)


async def get_project(id: PydanticObjectId) -> Project:
    project = await Project.get(id)
    if not project:
        raise ResourceNotFoundException()
    return project


async def delete_project(id: PydanticObjectId):
    project: Project = await Project.get(id)
    if not project:
        raise ResourceNotFoundException()
    return await project.delete()
