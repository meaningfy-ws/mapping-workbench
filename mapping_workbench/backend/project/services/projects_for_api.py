from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.project.models.project import Project
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
    project_data: Project = Project(**data)
    project_data.on_update(user=user)
    return await project.set(project_data.dict_for_update())


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
