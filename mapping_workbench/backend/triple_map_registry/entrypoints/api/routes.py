from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.triple_map_registry.models.entity import TripleMapRegistryOut, \
    TripleMapRegistryCreateIn, TripleMapRegistryUpdateIn, TripleMapRegistry
from mapping_workbench.backend.triple_map_registry.models.entity_api_response import \
    APIListTripleMapRegistriesPaginatedResponse
from mapping_workbench.backend.triple_map_registry.services.api import (
    list_triple_map_registries,
    create_triple_map_registry,
    update_triple_map_registry,
    get_triple_map_registry,
    delete_triple_map_registry, get_triple_map_registry_out
)
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/triple_map_registries"
TAG = "triple_map_registries"
NAME_FOR_MANY = "triple_map_registries"
NAME_FOR_ONE = "triple_map_registry"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListTripleMapRegistriesPaginatedResponse
)
async def route_list_triple_map_registries(
        project: PydanticObjectId = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    items: List[TripleMapRegistryOut] = await list_triple_map_registries(filters)
    return APIListTripleMapRegistriesPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=TripleMapRegistryOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_triple_map_registry(
        data: TripleMapRegistryCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_triple_map_registry(data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=TripleMapRegistryOut
)
async def route_update_triple_map_registry(
        data: TripleMapRegistryUpdateIn,
        triple_map_registry: TripleMapRegistry = Depends(get_triple_map_registry),
        user: User = Depends(current_active_user)
):
    return await update_triple_map_registry(triple_map_registry, data, user=user)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=TripleMapRegistryOut
)
async def route_get_triple_map_registry(
        triple_map_registry: TripleMapRegistryOut = Depends(get_triple_map_registry_out)):
    return triple_map_registry


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_triple_map_registry(triple_map_registry: TripleMapRegistry = Depends(get_triple_map_registry)):
    await delete_triple_map_registry(triple_map_registry)
    return APIEmptyContentWithIdResponse(id=triple_map_registry.id)
