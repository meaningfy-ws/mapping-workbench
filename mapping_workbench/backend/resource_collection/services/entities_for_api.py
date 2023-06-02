from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile
from mapping_workbench.backend.user.models.user import User


async def list_resource_collections() -> List[ResourceCollection]:
    return await ResourceCollection.find(fetch_links=False).to_list()


async def create_resource_collection(resource_collection: ResourceCollection, user: User) -> ResourceCollection:
    resource_collection.on_create(user=user)
    return await resource_collection.create()


async def update_resource_collection(id: PydanticObjectId, data: Dict, user: User):
    resource_collection: ResourceCollection = await ResourceCollection.get(id)
    if not resource_collection:
        raise ResourceNotFoundException()
    update_data = ResourceCollection(**data).on_update(user=user).dict_for_update()
    return await resource_collection.set(update_data)


async def get_resource_collection(id: PydanticObjectId) -> ResourceCollection:
    resource_collection = await ResourceCollection.get(id)
    if not resource_collection:
        raise ResourceNotFoundException()
    return resource_collection


async def delete_resource_collection(id: PydanticObjectId):
    resource_collection: ResourceCollection = await ResourceCollection.get(id)
    if not resource_collection:
        raise ResourceNotFoundException()
    return await resource_collection.delete()


async def list_resource_collection_file_resources(
        id: PydanticObjectId = None
) -> List[ResourceFile]:
    return await ResourceFile.find(
        ResourceFile.resource_collection == ResourceCollection.link_from_id(id),
        fetch_links=False
    ).to_list()


async def create_resource_collection_file_resource(
        id: PydanticObjectId,
        resource_file: ResourceFile,
        user: User
) -> ResourceFile:
    resource_file.resource_collection = ResourceCollection.link_from_id(id)
    resource_file.on_create(user=user)
    return await resource_file.create()


async def update_resource_file(id: PydanticObjectId, data: Dict, user: User):
    resource_file: ResourceFile = await ResourceFile.get(id)
    if not resource_file:
        raise ResourceNotFoundException()
    update_data = ResourceFile(**data).on_update(user=user).dict_for_update()
    return await resource_file.set(update_data)


async def get_resource_file(id: PydanticObjectId) -> ResourceFile:
    resource_file = await ResourceFile.get(id)
    if not resource_file:
        raise ResourceNotFoundException()
    return resource_file


async def delete_resource_file(id: PydanticObjectId):
    resource_file: ResourceFile = await ResourceFile.get(id)
    if not resource_file:
        raise ResourceNotFoundException()
    return await resource_file.delete()
