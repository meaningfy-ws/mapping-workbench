from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found, \
    request_create_data, prepare_search_param, pagination_params
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile, \
    ResourceFileUpdateIn, ResourceFileCreateIn
from mapping_workbench.backend.user.models.user import User


async def list_resource_collections(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[ResourceCollection], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[ResourceCollection] = await ResourceCollection.find(
        query_filters,
        projection_model=ResourceCollection,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()

    total_count: int = await ResourceCollection.find(query_filters).count()
    return items, total_count


async def create_resource_collection(resource_collection: ResourceCollection, user: User) -> ResourceCollection:
    resource_collection.on_create(user=user)
    return await resource_collection.create()


async def update_resource_collection(
        resource_collection: ResourceCollection,
        data: ResourceCollection,
        user: User
) -> ResourceCollection:
    return await resource_collection.set(
        request_update_data(data, user=user)
    )


async def get_resource_collection(id: PydanticObjectId) -> ResourceCollection:
    resource_collection: ResourceCollection = await ResourceCollection.get(id, fetch_links=False)
    if not api_entity_is_found(resource_collection):
        raise ResourceNotFoundException()
    return ResourceCollection(**resource_collection.model_dump())


async def delete_resource_collection(resource_collection: ResourceCollection):
    return await resource_collection.delete()


async def list_resource_collection_file_resources(
        resource_collection: ResourceCollection,
        filters=None, page: int = None, limit: int = None
):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    query_filters['resource_collection'] = ResourceCollection.link_from_id(resource_collection.id)

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[ResourceFile] = await ResourceFile.find(
        query_filters,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await ResourceFile.find(query_filters).count()
    return items, total_count


async def create_resource_collection_file_resource(
        resource_collection: ResourceCollection,
        data: ResourceFileCreateIn,
        user: User
) -> ResourceFile:
    data.resource_collection = resource_collection
    resource_file = ResourceFile(**request_create_data(data, user=user))
    return await resource_file.create()


async def update_resource_file(
        resource_file: ResourceFile,
        data: ResourceFileUpdateIn,
        user: User) -> ResourceFile:
    return await resource_file.set(
        request_update_data(data, user=user)
    )


async def get_resource_file(id: PydanticObjectId) -> ResourceFile:
    resource_file = await ResourceFile.get(id)
    if not api_entity_is_found(resource_file):
        raise ResourceNotFoundException()
    return resource_file


async def delete_resource_file(resource_file: ResourceFile):
    return await resource_file.delete()
