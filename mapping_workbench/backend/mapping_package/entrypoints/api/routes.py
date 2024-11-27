from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageOut, MappingPackageCreateIn, \
    MappingPackageUpdateIn, MappingPackage, MappingPackageStateGate, MappingPackageState
from mapping_workbench.backend.mapping_package.models.entity_api_request import APIDeleteMappingPackageRequest
from mapping_workbench.backend.mapping_package.models.entity_api_response import \
    APIListMappingPackagesPaginatedResponse, APIListMappingPackageStatesPaginatedResponse
from mapping_workbench.backend.mapping_package.services.api import (
    list_mapping_packages,
    create_mapping_package,
    update_mapping_package,
    get_mapping_package,
    delete_mapping_package, get_mapping_package_out, list_mapping_package_states, get_mapping_package_state,
    delete_mapping_package_state
)
from mapping_workbench.backend.mapping_package.services.data import get_latest_mapping_package_state_gate, \
    DEFAULT_PACKAGE_NAME, DEFAULT_PACKAGE_IDENTIFIER, get_latest_mapping_package_state
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.api import get_project
from mapping_workbench.backend.project.services.tasks import add_task_remove_project_orphan_shareable_resources
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/mapping_packages"
TAG = "mapping_packages"
NAME_FOR_MANY = "mapping_packages"
NAME_FOR_ONE = "mapping_package"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListMappingPackagesPaginatedResponse
)
async def route_list_mapping_packages(
        project: PydanticObjectId = None,
        page: int = None,
        limit: int = None,
        q: str = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if q is not None:
        filters['q'] = q

    await get_project(project)

    items, total_count = await list_mapping_packages(filters, page, limit)
    return APIListMappingPackagesPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=MappingPackageOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_mapping_package(
        data: MappingPackageCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_mapping_package(data, user=user)


@router.post(
    "/create_default",
    description=f"Create Default {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_default_{NAME_FOR_ONE}",
    response_model=MappingPackageOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_default_mapping_package(
        project_id: PydanticObjectId = None,
        user: User = Depends(current_active_user)
):
    project: Project = await get_project(project_id)

    package_epo_version = (project.target_ontology and project.target_ontology.version) or ""
    package_eforms_sdk_versions = [project.source_schema.version] if (
            project.source_schema and project.source_schema.version
    ) else []

    data: MappingPackageCreateIn = MappingPackageCreateIn(
        title=DEFAULT_PACKAGE_NAME,
        description=project.description,
        identifier=DEFAULT_PACKAGE_IDENTIFIER,
        mapping_version=project.version or "",
        epo_version=package_epo_version,
        eform_subtypes=[],
        eforms_sdk_versions=package_eforms_sdk_versions,
        project=Project.link_from_id(project.id)
    )
    return await create_mapping_package(data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=MappingPackageOut
)
async def route_update_mapping_package(
        data: MappingPackageUpdateIn,
        mapping_package: MappingPackage = Depends(get_mapping_package),
        user: User = Depends(current_active_user)
):
    return await update_mapping_package(mapping_package, data, user=user)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=MappingPackageOut
)
async def route_get_mapping_package(mapping_package: MappingPackageOut = Depends(get_mapping_package_out)):
    return mapping_package


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_mapping_package(
        mapping_package: MappingPackage = Depends(get_mapping_package),
        data: APIDeleteMappingPackageRequest = None,
        user: User = Depends(current_active_user)
):
    await delete_mapping_package(mapping_package=mapping_package)
    if data and data.cleanup_project:
        add_task_remove_project_orphan_shareable_resources(mapping_package.project.to_ref().id, user.email)

    return APIEmptyContentWithIdResponse(id=mapping_package.id)


# Mapping Package State routes

@router.get(
    "/{id}/states",
    description=f"List {NAME_FOR_MANY} States",
    name=f"{NAME_FOR_MANY}:list_states",
    response_model=APIListMappingPackageStatesPaginatedResponse
)
async def route_list_mapping_package_states(
        project: PydanticObjectId = None,
        mapping_package: MappingPackage = Depends(get_mapping_package),
        page: int = None,
        limit: int = None,
        q: str = None,
        sort_field: str = None,
        sort_dir: int = None
):
    filters: dict = {}
    filters['mapping_package_oid'] = mapping_package.id
    if project:
        filters['project'] = Project.link_from_id(project)
    if q is not None:
        filters['q'] = q

    items, total_count = await list_mapping_package_states(filters, page, limit, sort_field, sort_dir)
    return APIListMappingPackageStatesPaginatedResponse(
        items=items,
        count=total_count
    )


@router.get(
    "/state/{id}",
    description=f"Get {NAME_FOR_ONE} State",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}_state",
    response_model=MappingPackageStateGate
)
async def route_get_mapping_package_state(
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    return mapping_package_state


@router.delete(
    "/state/{id}",
    description=f"Delete {NAME_FOR_ONE} State",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}_state",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_mapping_package_state(
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)):
    await delete_mapping_package_state(mapping_package_state)
    return APIEmptyContentWithIdResponse(id=mapping_package_state.id)


@router.get(
    "/{id}/latest_state",
    description=f"Get {NAME_FOR_ONE} Latest State",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}_latest_state",
    response_model=MappingPackageStateGate
)
async def route_get_latest_package_state(
        mapping_package: MappingPackage = Depends(get_mapping_package)
):
    return await get_latest_mapping_package_state_gate(mapping_package)


@router.get(
    "/{id}/latest_state_content",
    description=f"Get {NAME_FOR_ONE} Latest State Content",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}_latest_state_content",
    response_model=MappingPackageState
)
async def route_get_latest_package_state_content(
        mapping_package: MappingPackage = Depends(get_mapping_package)
):
    return await get_latest_mapping_package_state(mapping_package)
