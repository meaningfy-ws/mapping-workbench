from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from mapping_workbench.backend.core.models.api_response import JSONEmptyContentWithId, JSONPagedResponse
from mapping_workbench.backend.project.models.entity import ProjectOut, ProjectCreateIn, ProjectUpdateIn
from mapping_workbench.backend.project.services.entities_for_api import (
    list_projects as list_projects_for_api,
    create_project as create_project_for_api,
    update_project as update_project_for_api,
    get_project as get_project_for_api,
    delete_project as delete_project_for_api
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
    description="List projects",
    name=f"{NAME_FOR_MANY}:list",
    response_model=List[ProjectOut]
)
async def list_projects() -> JSONResponse:
    items = await list_projects_for_api()
    return JSONResponse(
        content=jsonable_encoder(JSONPagedResponse(items=items, count=len(items)))
    )


@router.post(
    "",
    description="Add new project",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=ProjectOut
)
async def create_project(
        project: ProjectCreateIn,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await create_project_for_api(project_data=project, user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@router.patch(
    "/{id}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=ProjectOut
)
async def update_project(
        id: PydanticObjectId,
        project: ProjectUpdateIn,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    await update_project_for_api(id, project, user=user)
    project: ProjectOut = await get_project_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(project)
    )


@router.get(
    "/{id}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=ProjectOut
)
async def get_project(id: PydanticObjectId) -> JSONResponse:
    data = await get_project_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.delete(
    "/{id}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=JSONEmptyContentWithId
)
async def delete_project(id: PydanticObjectId):
    await delete_project_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )
