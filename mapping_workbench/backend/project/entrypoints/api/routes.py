from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.project.models.entity import ProjectOut, ProjectCreateIn, ProjectUpdateIn
from mapping_workbench.backend.project.models.entity_api_response import APIListProjectsPaginatedResponse
from mapping_workbench.backend.project.services.api import (
    list_projects,
    create_project,
    update_project,
    get_project,
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
async def route_list_projects():
    items: List[ProjectOut] = await list_projects()
    return APIListProjectsPaginatedResponse(
        items=items,
        count=len(items)
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
    return await get_project(id)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=ProjectOut
)
async def route_get_project(project: ProjectOut = Depends(get_project)):
    return project


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_project(id: PydanticObjectId):
    await delete_project(id)
    return APIEmptyContentWithIdResponse(_id=id)
