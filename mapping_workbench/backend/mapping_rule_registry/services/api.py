from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingRuleRegistry, \
    MappingRuleRegistryCreateIn, MappingRuleRegistryUpdateIn, MappingRuleRegistryOut
from mapping_workbench.backend.user.models.user import User


async def list_mapping_rule_registries(filters=None) -> List[MappingRuleRegistryOut]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await MappingRuleRegistry.find(
        query_filters,
        projection_model=MappingRuleRegistryOut,
        fetch_links=False
    ).to_list()


async def create_mapping_rule_registry(
        data: MappingRuleRegistryCreateIn,
        user: User
) -> MappingRuleRegistryOut:
    mapping_rule_registry: MappingRuleRegistry = \
        MappingRuleRegistry(
            **request_create_data(data, user=user)
        )
    try:
        await mapping_rule_registry.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return MappingRuleRegistryOut(**mapping_rule_registry.model_dump())


async def update_mapping_rule_registry(
        mapping_rule_registry: MappingRuleRegistry,
        data: MappingRuleRegistryUpdateIn,
        user: User
) -> MappingRuleRegistryOut:
    return MappingRuleRegistryOut(**(
        await mapping_rule_registry.set(request_update_data(data, user=user))
    ))


async def get_mapping_rule_registry(id: PydanticObjectId) -> MappingRuleRegistry:
    mapping_rule_registry: MappingRuleRegistry = await MappingRuleRegistry.get(id)
    if not api_entity_is_found(mapping_rule_registry):
        raise ResourceNotFoundException()
    return mapping_rule_registry


async def get_mapping_rule_registry_out(id: PydanticObjectId) -> MappingRuleRegistryOut:
    mapping_rule_registry: MappingRuleRegistry = await get_mapping_rule_registry(id)
    return MappingRuleRegistryOut(**mapping_rule_registry.model_dump(by_alias=False))


async def delete_mapping_rule_registry(mapping_rule_registry: MappingRuleRegistry):
    return await mapping_rule_registry.delete()
