from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.project.models.entity import Project, ProjectCreateIn, ProjectUpdateIn, ProjectOut
from mapping_workbench.backend.user.models.user import User


async def list_projects(filters=None) -> List[ProjectOut]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await Project.find(query_filters, projection_model=ProjectOut, fetch_links=False).to_list()


async def create_project(project_data: ProjectCreateIn, user: User) -> ProjectOut:
    project: Project = Project(**request_create_data(project_data)).on_create(user=user)
    try:
        await project.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return ProjectOut(**project.model_dump())


async def update_project(id: PydanticObjectId, project_data: ProjectUpdateIn, user: User):
    project: Project = await Project.get(id)
    if not api_entity_is_found(project):
        raise ResourceNotFoundException()

    request_data = request_update_data(project_data)
    update_data = request_update_data(Project(**request_data).on_update(user=user))
    return await project.set(update_data)


async def get_project(id: PydanticObjectId) -> Project:
    project: Project = await Project.get(id)
    if not api_entity_is_found(project):
        raise ResourceNotFoundException()
    return project


async def get_project_out(id: PydanticObjectId) -> ProjectOut:
    project: Project = await get_project(id)
    return ProjectOut(**project.model_dump(by_alias=False))


async def delete_project(project: Project):
    return await project.delete()
