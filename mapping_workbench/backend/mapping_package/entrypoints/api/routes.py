from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageOut, MappingPackageCreateIn, \
    MappingPackageUpdateIn, MappingPackage, MappingPackageState, MappingPackageStateGate
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
from mapping_workbench.backend.project.models.entity import Project
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
async def route_delete_mapping_package(mapping_package: MappingPackage = Depends(get_mapping_package)):
    await delete_mapping_package(mapping_package)
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
        q: str = None
):
    filters: dict = {}
    filters['identifier'] = mapping_package.identifier
    if project:
        filters['project'] = Project.link_from_id(project)
    if q is not None:
        filters['q'] = q

    items, total_count = await list_mapping_package_states(filters, page, limit)
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
