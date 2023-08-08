from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageOut, MappingPackageCreateIn, MappingPackageUpdateIn
from mapping_workbench.backend.mapping_package.models.entity_api_response import APIListMappingPackagesPaginatedResponse
from mapping_workbench.backend.mapping_package.services.api import (
    list_mapping_packages,
    create_mapping_package,
    update_mapping_package,
    get_mapping_package,
    delete_mapping_package
)
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
async def route_list_mapping_packages():
    items: List[MappingPackageOut] = await list_mapping_packages()
    return APIListMappingPackagesPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=MappingPackageOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_mapping_package(
        mapping_package_data: MappingPackageCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_mapping_package(mapping_package_data=mapping_package_data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=MappingPackageOut
)
async def route_update_mapping_package(
        id: PydanticObjectId,
        mapping_package_data: MappingPackageUpdateIn,
        user: User = Depends(current_active_user)
):
    await update_mapping_package(id=id, mapping_package_data=mapping_package_data, user=user)
    return await get_mapping_package(id)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=MappingPackageOut
)
async def route_get_mapping_package(mapping_package: MappingPackageOut = Depends(get_mapping_package)):
    return mapping_package


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_mapping_package(id: PydanticObjectId):
    await delete_mapping_package(id)
    return APIEmptyContentWithIdResponse(_id=id)