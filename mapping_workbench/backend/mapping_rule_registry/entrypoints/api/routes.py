from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingRuleRegistryOut, \
    MappingRuleRegistryCreateIn, MappingRuleRegistryUpdateIn
from mapping_workbench.backend.mapping_rule_registry.models.entity_api_response import \
    APIListMappingRuleRegistriesPaginatedResponse
from mapping_workbench.backend.mapping_rule_registry.services.api import (
    list_mapping_rule_registries,
    create_mapping_rule_registry,
    update_mapping_rule_registry,
    get_mapping_rule_registry,
    delete_mapping_rule_registry
)
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/mapping_rule_registries"
TAG = "mapping_rule_registries"
NAME_FOR_MANY = "mapping_rule_registries"
NAME_FOR_ONE = "mapping_rule_registry"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListMappingRuleRegistriesPaginatedResponse
)
async def route_list_mapping_rule_registries():
    items: List[MappingRuleRegistryOut] = await list_mapping_rule_registries()
    return APIListMappingRuleRegistriesPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=MappingRuleRegistryOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_mapping_rule_registry(
        mapping_rule_registry_data: MappingRuleRegistryCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_mapping_rule_registry(mapping_rule_registry_data=mapping_rule_registry_data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=MappingRuleRegistryOut
)
async def route_update_mapping_rule_registry(
        id: PydanticObjectId,
        mapping_rule_registry_data: MappingRuleRegistryUpdateIn,
        user: User = Depends(current_active_user)
):
    await update_mapping_rule_registry(id=id, mapping_rule_registry_data=mapping_rule_registry_data, user=user)
    return await get_mapping_rule_registry(id)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=MappingRuleRegistryOut
)
async def route_get_mapping_rule_registry(
        mapping_rule_registry: MappingRuleRegistryOut = Depends(get_mapping_rule_registry)):
    return mapping_rule_registry


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_mapping_rule_registry(id: PydanticObjectId):
    await delete_mapping_rule_registry(id)
    return APIEmptyContentWithIdResponse(_id=id)
