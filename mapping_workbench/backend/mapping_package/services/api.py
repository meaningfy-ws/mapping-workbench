from typing import List

import pymongo
from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageCreateIn, \
    MappingPackageUpdateIn, MappingPackageOut, MappingPackageStateGate
from mapping_workbench.backend.user.models.user import User


async def list_mapping_packages(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[MappingPackageOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[MappingPackageOut] = await MappingPackage.find(
        query_filters,
        projection_model=MappingPackageOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await MappingPackage.find(query_filters).count()
    return items, total_count


async def create_mapping_package(
        data: MappingPackageCreateIn,
        user: User
) -> MappingPackageOut:
    mapping_package: MappingPackage = \
        MappingPackage(
            **request_create_data(data, user=user)
        )
    try:
        await mapping_package.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return MappingPackageOut(**mapping_package.model_dump())


async def update_mapping_package(
        mapping_package: MappingPackage,
        data: MappingPackageUpdateIn,
        user: User
) -> MappingPackageOut:
    return MappingPackageOut(**(
        await mapping_package.set(request_update_data(data, user=user))
    ).model_dump())


async def get_mapping_package(id: PydanticObjectId) -> MappingPackage:
    mapping_package: MappingPackage = await MappingPackage.get(id)
    if not api_entity_is_found(mapping_package):
        raise ResourceNotFoundException()
    return mapping_package


async def get_mapping_package_out(id: PydanticObjectId) -> MappingPackageOut:
    mapping_package: MappingPackage = await get_mapping_package(id)
    return MappingPackageOut(**mapping_package.model_dump(by_alias=False))


async def delete_mapping_package(mapping_package: MappingPackage):
    return await mapping_package.delete()


# Mapping Package States

async def list_mapping_package_states(filters: dict = None, page: int = None, limit: int = None,
                                      sort_field: str = None, sort_dir: int = None) -> \
        (List[MappingPackageStateGate], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    sort = -MappingPackageStateGate.created_at
    if sort_field is not None:
        sort = [(sort_field, sort_dir or pymongo.ASCENDING)]
    items: List[MappingPackageStateGate] = await MappingPackageStateGate.find(
        query_filters,
        projection_model=MappingPackageStateGate,
        fetch_links=False,
        sort=sort,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await MappingPackageStateGate.find(query_filters).count()
    return items, total_count


async def get_mapping_package_state(id: PydanticObjectId) -> MappingPackageStateGate:
    mapping_package_state: MappingPackageStateGate = await MappingPackageStateGate.get(id)
    if not mapping_package_state:
        raise ResourceNotFoundException()
    return mapping_package_state


async def delete_mapping_package_state(mapping_package_state: MappingPackageStateGate):
    return await mapping_package_state.delete()
