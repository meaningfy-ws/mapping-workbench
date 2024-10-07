from typing import List

from beanie import PydanticObjectId, Link
from bson import DBRef
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import DuplicateKeyException, FailedDependency
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.project.models.entity import Project, ProjectCreateIn, ProjectUpdateIn, ProjectOut, \
    ProjectNotFoundException
from mapping_workbench.backend.project.services.data import remove_project_orphan_shareable_resources
from mapping_workbench.backend.user.models.user import User


async def list_projects(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[ProjectOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[ProjectOut] = await Project.find(
        query_filters,
        projection_model=ProjectOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()

    total_count: int = await Project.find(query_filters).count()
    return items, total_count


async def create_project(data: ProjectCreateIn, user: User) -> ProjectOut:
    project: Project = \
        Project(
            **request_create_data(data, user=user)
        )
    try:
        await project.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return ProjectOut(**project.model_dump())


async def update_project(
        project: Project,
        data: ProjectUpdateIn,
        user: User
) -> ProjectOut:
    return ProjectOut(**(
        await project.set(request_update_data(data, user=user))
    ).model_dump())


async def get_project(id: PydanticObjectId) -> Project:
    project: Project = await Project.get(id)
    if not api_entity_is_found(project):
        raise FailedDependency()
    return project


async def get_project_out(id: PydanticObjectId) -> ProjectOut:
    project: Project = await get_project(id)
    return ProjectOut(**project.model_dump(by_alias=False))


async def delete_project(project: Project):
    return await project.delete()


async def get_project_link(project_id: PydanticObjectId):
    if await Project.get(project_id) is None:
        raise ProjectNotFoundException(f"Project {project_id} doesn't exist")
    return Link(DBRef(Project.Settings.name, project_id), Project)


async def cleanup_project(project: Project):
    await remove_project_orphan_shareable_resources(project.id)
