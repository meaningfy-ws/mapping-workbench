from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.project.models.entity import ProjectOut, ProjectCreateIn, ProjectUpdateIn, Project
from mapping_workbench.backend.project.models.entity_api_response import APIListProjectsPaginatedResponse
from mapping_workbench.backend.project.services.api import (
    list_projects,
    create_project,
    update_project,
    get_project,
    get_project_out,
    delete_project
)
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/projects"
TAG = "projects"
NAME_FOR_MANY = "projects"
NAME_FOR_ONE = "project"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListProjectsPaginatedResponse
)
async def route_list_projects(
        page: int = None,
        limit: int = None,
        q: str = None
):
    filters: dict = {}
    if q is not None:
        filters['q'] = q

    items, total_count = await list_projects(filters, page, limit)
    return APIListProjectsPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=ProjectOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_project(
        project_data: ProjectCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_project(project_data=project_data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=ProjectOut
)
async def route_update_project(
        id: PydanticObjectId,
        project_data: ProjectUpdateIn,
        user: User = Depends(current_active_user)
):
    await update_project(id=id, project_data=project_data, user=user)
    return await get_project_out(id)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=ProjectOut
)
async def route_get_project(project: ProjectOut = Depends(get_project_out)):
    return project


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_project(project: Project = Depends(get_project)):
    await delete_project(project)
    return APIEmptyContentWithIdResponse(_id=project.id)
