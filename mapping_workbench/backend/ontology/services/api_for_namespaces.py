from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.ontology.models.namespace import Namespace, NamespaceIn, NamespaceOut
from mapping_workbench.backend.user.models.user import User


async def list_namespaces(filters=None) -> List[NamespaceOut]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await Namespace.find(query_filters, projection_model=NamespaceOut, fetch_links=False).to_list()


async def create_namespace(namespace_data: NamespaceIn, user: User) -> NamespaceOut:
    namespace: Namespace = Namespace(**request_create_data(namespace_data)).on_create(user=user)
    try:
        await namespace.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return NamespaceOut(**namespace.dict())


async def update_namespace(id: PydanticObjectId, namespace_data: NamespaceIn, user: User):
    namespace: Namespace = await Namespace.get(id)
    if not api_entity_is_found(namespace):
        raise ResourceNotFoundException()

    request_data = request_update_data(namespace_data)
    update_data = request_update_data(Namespace(**request_data).on_update(user=user))
    return await namespace.set(update_data)


async def get_namespace(id: PydanticObjectId) -> Namespace:
    namespace: Namespace = await Namespace.get(id)
    if not api_entity_is_found(namespace):
        raise ResourceNotFoundException()
    return namespace


async def get_namespace_out(id: PydanticObjectId) -> NamespaceOut:
    namespace: Namespace = await get_namespace(id)
    return NamespaceOut(**namespace.dict(by_alias=False))


async def delete_namespace(namespace: Namespace):
    return await namespace.delete()
