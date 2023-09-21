from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.triple_map_registry.models.entity import TripleMapRegistry, \
    TripleMapRegistryCreateIn, TripleMapRegistryUpdateIn, TripleMapRegistryOut
from mapping_workbench.backend.user.models.user import User


async def list_triple_map_registries(filters=None) -> List[TripleMapRegistryOut]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await TripleMapRegistry.find(
        query_filters,
        projection_model=TripleMapRegistryOut,
        fetch_links=False
    ).to_list()


async def create_triple_map_registry(triple_map_registry_data: TripleMapRegistryCreateIn,
                                     user: User) -> TripleMapRegistryOut:
    triple_map_registry: TripleMapRegistry = TripleMapRegistry(
        **request_create_data(triple_map_registry_data)).on_create(user=user)
    try:
        await triple_map_registry.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return TripleMapRegistryOut(**triple_map_registry.model_dump())


async def update_triple_map_registry(id: PydanticObjectId,
                                     triple_map_registry_data: TripleMapRegistryUpdateIn, user: User):
    triple_map_registry: TripleMapRegistry = await TripleMapRegistry.get(id)
    if not api_entity_is_found(triple_map_registry):
        raise ResourceNotFoundException()

    request_data = request_update_data(triple_map_registry_data)
    update_data = request_update_data(TripleMapRegistry(**request_data).on_update(user=user))
    return await triple_map_registry.set(update_data)


async def get_triple_map_registry(id: PydanticObjectId) -> TripleMapRegistry:
    triple_map_registry: TripleMapRegistry = await TripleMapRegistry.get(id)
    if not api_entity_is_found(triple_map_registry):
        raise ResourceNotFoundException()
    return triple_map_registry


async def get_triple_map_registry_out(id: PydanticObjectId) -> TripleMapRegistryOut:
    triple_map_registry: TripleMapRegistry = await get_triple_map_registry(id)
    return TripleMapRegistryOut(**triple_map_registry.model_dump(by_alias=False))


async def delete_triple_map_registry(triple_map_registry: TripleMapRegistry):
    return await triple_map_registry.delete()
