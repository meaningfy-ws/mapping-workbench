from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.project.models.entity import Project, ProjectCreateIn, ProjectUpdateIn, ProjectOut
from mapping_workbench.backend.user.models.user import User


async def list_projects(filters=None) -> List[ProjectOut]:
    filters_data: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await Project.find(filters_data, projection_model=ProjectOut, fetch_links=False).to_list()


async def create_project(project_data: ProjectCreateIn, user: User) -> ProjectOut:
    project: Project = Project(**project_data.dict())
    project.on_create(user=user)
    return ProjectOut(**(await project.create()).dict())


async def update_project(id: PydanticObjectId, project_data: ProjectUpdateIn, user: User):
    project: Project = await Project.get(id)
    if not project:
        raise ResourceNotFoundException()
    update_data = Project(**project_data.dict()).on_update(user=user).dict_for_update()
    return await project.set(update_data)


async def get_project(id: PydanticObjectId) -> ProjectOut:
    project: ProjectOut = ProjectOut(**(await Project.get(id)).dict(by_alias=False))
    if not project:
        raise ResourceNotFoundException()
    return project


async def delete_project(id: PydanticObjectId):
    project: Project = await Project.get(id)
    if not project:
        raise ResourceNotFoundException()
    return await project.delete()
