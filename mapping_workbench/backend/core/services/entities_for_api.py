from typing import List, Dict, TypeVar

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User

T = TypeVar("T", BaseEntity, BaseEntity)


async def list_entities(entity_base: BaseEntity) -> List[T]:
    return await entity_base.find(fetch_links=False).to_list()


async def create_entity(entity: T, user: User) -> T:
    entity.on_create(user=user)
    return await entity.create()


async def update_entity(entity_base: T, id: PydanticObjectId, data: Dict, user: User):
    entity: entity_base = await entity_base.get(id)
    if not entity:
        raise ResourceNotFoundException()
    update_data = entity_base(**data).on_update(user=user).dict_for_update()
    return await entity.set(update_data)


async def get_entity(entity_base: T, id: PydanticObjectId) -> T:
    entity = await entity_base.get(id)
    if not entity:
        raise ResourceNotFoundException()
    return entity


async def delete_entity(entity_base: T, id: PydanticObjectId):
    entity: Project = await entity_base.get(id)
    if not entity:
        raise ResourceNotFoundException()
    return await entity.delete()
