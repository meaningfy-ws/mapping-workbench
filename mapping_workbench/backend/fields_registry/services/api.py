from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.fields_registry.models.field_registry import FieldsRegistry, FieldsRegistryCreateIn, \
    FieldsRegistryUpdateIn, FieldsRegistryOut
from mapping_workbench.backend.fields_registry.models.field_registry_diff import FieldsRegistryDiff
from mapping_workbench.backend.fields_registry.services.fields_registry_differ import get_fields_registry_diff
from mapping_workbench.backend.user.models.user import User


async def list_fields_registries(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[FieldsRegistryOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[FieldsRegistryOut] = await FieldsRegistry.find(
        query_filters,
        projection_model=FieldsRegistryOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()

    total_count: int = await FieldsRegistry.find(query_filters).count()
    return items, total_count


async def create_fields_registry(
        data: FieldsRegistryCreateIn,
        user: User
) -> FieldsRegistryOut:
    fields_registry: FieldsRegistry = \
        FieldsRegistry(
            **request_create_data(data, user=user)
        )
    try:
        await fields_registry.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return FieldsRegistryOut(**fields_registry.model_dump())


async def update_fields_registry(
        fields_registry: FieldsRegistry,
        data: FieldsRegistryUpdateIn,
        user: User
) -> FieldsRegistryOut:
    return FieldsRegistryOut(**(
        await fields_registry.set(request_update_data(data, user=user))
    ).model_dump())


async def get_fields_registry(id: PydanticObjectId) -> FieldsRegistry:
    fields_registry: FieldsRegistry = await FieldsRegistry.get(id)
    if not api_entity_is_found(fields_registry):
        raise ResourceNotFoundException()
    return fields_registry


async def get_fields_registry_out(id: PydanticObjectId) -> FieldsRegistryOut:
    fields_registry: FieldsRegistry = await get_fields_registry(id)
    return FieldsRegistryOut(**fields_registry.model_dump(by_alias=False))


async def delete_fields_registry(fields_registry: FieldsRegistry):
    return await fields_registry.delete()


async def get_fields_registry_diff_by_id(old_fields_registry_id: PydanticObjectId,
                                         new_fields_registry_id: PydanticObjectId) -> FieldsRegistryDiff:
    old_fields_registry: FieldsRegistry = await get_fields_registry(old_fields_registry_id)
    new_fields_registry: FieldsRegistry = await get_fields_registry(new_fields_registry_id)
    return get_fields_registry_diff(old_field_registry=old_fields_registry,
                                    new_field_registry=new_fields_registry)
