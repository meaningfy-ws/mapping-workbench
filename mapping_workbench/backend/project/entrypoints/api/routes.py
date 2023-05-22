from typing import Dict

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from mapping_workbench.backend.core.models.api_response import JSONEmptyContentWithId
from mapping_workbench.backend.project.models.project import Project
from mapping_workbench.backend.project.services.projects_for_api import (
    list_projects as list_projects_for_api,
    create_project as create_project_for_api,
    update_project as update_project_for_api,
    get_project as get_project_for_api,
    delete_project as delete_project_for_api
)
from mapping_workbench.backend.user.models.user import User
from mapping_workbench.backend.security.services.user_manager import current_active_user

ROUTE_PREFIX = "/projects"
TAG = "projects"

sub_router = APIRouter()


@sub_router.get(
    "",
    description="List projects",
    name="projects:list"
)
async def list_projects() -> JSONResponse:
    projects_data = await list_projects_for_api()
    return JSONResponse(
        content=jsonable_encoder(projects_data)
    )


@sub_router.post(
    "",
    description="Add new project",
    name="projects:create_project"
)
async def create_project(
        project: Project,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    project_data = await create_project_for_api(project=project, user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(project_data)
    )


@sub_router.put(
    "/{id}",
    name="projects:update_project"
)
async def update_project(
        id: PydanticObjectId,
        project_data: Dict,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    await update_project_for_api(id, project_data, user=user)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(id=id))
    )


@sub_router.get(
    "/{id}",
    name="projects:get_project"
)
async def get_project(id: PydanticObjectId) -> JSONResponse:
    project_data = await get_project_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(project_data)
    )


@sub_router.delete(
    "/{id}",
    name="projects:delete_project"
)
async def delete_project(id: PydanticObjectId):
    await delete_project_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(id=id))
    )


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
