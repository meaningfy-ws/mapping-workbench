from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found, \
    request_create_data
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile, \
    ResourceFileUpdateIn, ResourceFileCreateIn
from mapping_workbench.backend.user.models.user import User


async def list_resource_collections(filters=None) -> List[ResourceCollection]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await ResourceCollection.find(
        query_filters,
        projection_model=ResourceCollection,
        fetch_links=False
    ).to_list()


async def create_resource_collection(resource_collection: ResourceCollection, user: User) -> ResourceCollection:
    resource_collection.on_create(user=user)
    return await resource_collection.create()


async def update_resource_collection(id: PydanticObjectId, resource_collection_data: ResourceCollection, user: User):
    resource_collection: ResourceCollection = await ResourceCollection.get(id)
    if not api_entity_is_found(resource_collection):
        raise ResourceNotFoundException()

    request_data = request_update_data(resource_collection_data)
    update_data = request_update_data(ResourceCollection(**request_data).on_update(user=user))
    return await resource_collection.set(update_data)


async def get_resource_collection(id: PydanticObjectId) -> ResourceCollection:
    resource_collection: ResourceCollection = await ResourceCollection.get(id)
    if not api_entity_is_found(resource_collection):
        raise ResourceNotFoundException()
    return ResourceCollection(**resource_collection.dict(by_alias=False))


async def delete_resource_collection(id: PydanticObjectId):
    resource_collection: ResourceCollection = await ResourceCollection.get(id)
    if not api_entity_is_found(resource_collection):
        raise ResourceNotFoundException()
    return await resource_collection.delete()


async def list_resource_collection_file_resources(
        id: PydanticObjectId = None,
        filters=None
) -> List[ResourceFile]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await ResourceFile.find(
        ResourceFile.resource_collection == ResourceCollection.link_from_id(id),
        query_filters,
        fetch_links=False
    ).to_list()


async def create_resource_collection_file_resource(
        resource_collection: ResourceCollection,
        data: ResourceFileCreateIn,
        user: User
) -> ResourceFile:
    data.resource_collection = resource_collection
    resource_file = ResourceFile(**request_create_data(data)).on_create(user=user)
    return await resource_file.create()


async def update_resource_file(
        resource_file: ResourceFile,
        data: ResourceFileUpdateIn,
        user: User) -> ResourceFile:
    update_data = request_update_data(
        ResourceFile(**request_update_data(data)).on_update(user=user)
    )
    return await resource_file.set(update_data)


async def get_resource_file(id: PydanticObjectId) -> ResourceFile:
    resource_file = await ResourceFile.get(id)
    if not api_entity_is_found(resource_file):
        raise ResourceNotFoundException()
    return resource_file


async def delete_resource_file(id: PydanticObjectId):
    resource_file: ResourceFile = await ResourceFile.get(id)
    if not api_entity_is_found(resource_file):
        raise ResourceNotFoundException()
    return await resource_file.delete()
