import io

from fastapi import APIRouter, Depends, status
from starlette.responses import StreamingResponse

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
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
from mapping_workbench.backend.project.services.export_source_files import export_source_files
from mapping_workbench.backend.project.services.tasks import add_task_remove_project_orphan_shareable_resources
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
        data: ProjectCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_project(data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=ProjectOut
)
async def route_update_project(
        data: ProjectUpdateIn,
        project: Project = Depends(get_project),
        user: User = Depends(current_active_user)
):
    return await update_project(project, data, user=user)


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
    return APIEmptyContentWithIdResponse(id=project.id)


@router.post(
    "/{id}/cleanup",
    description=f"Cleanup {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:cleanup_{NAME_FOR_ONE}",
    status_code=status.HTTP_201_CREATED
)
async def route_cleanup_project(
        project: Project = Depends(get_project),
        user: User = Depends(current_active_user)
):
    return add_task_remove_project_orphan_shareable_resources(project.id, user.email).task_metadata


@router.post(
    "/{id}/export_source_files",
    description=f"Export {NAME_FOR_ONE} source files",
    name=f"{NAME_FOR_ONE}:export_source_files",
    status_code=status.HTTP_200_OK
)
async def route_export_source_files(
        project: Project = Depends(get_project),
):
    try:
        archive: bytes = await export_source_files(project)
    except ResourceNotFoundException as http_exception:
        raise http_exception

    return StreamingResponse(
        io.BytesIO(archive),
        media_type="application/x-zip-compressed"
    )
