import logging
from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.ontology.models.namespace import Namespace, NamespaceIn, NamespaceOut
from mapping_workbench.backend.user.models.user import User


async def list_namespaces(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[NamespaceOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[NamespaceOut] = await Namespace.find(
        query_filters,
        projection_model=NamespaceOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await Namespace.find(query_filters).count()
    return items, total_count


async def create_namespace(data: NamespaceIn, user: User) -> NamespaceOut:
    namespace: Namespace = \
        Namespace(
            **request_create_data(data, user=user)
        )
    try:
        await namespace.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return NamespaceOut(**namespace.model_dump())


async def create_namespaces(namespaces_in: List[NamespaceIn], user: User) -> List[NamespaceOut]:
    namespaces: List[NamespaceOut] = []
    for namespace_in in namespaces_in:
        namespace: Namespace = Namespace(**request_create_data(namespace_in, user=user))
        try:
            await namespace.create()
        except DuplicateKeyError as e:
            logging.warning("Namespace already exists")
        else:
            namespaces.append(NamespaceOut(**namespace.model_dump()))
    return namespaces


async def update_namespace(
        namespace: Namespace,
        data: NamespaceIn,
        user: User
) -> NamespaceOut:
    return NamespaceOut(**(
        await namespace.set(request_update_data(data, user=user))
    ).model_dump())


async def get_namespace(id: PydanticObjectId) -> Namespace:
    namespace: Namespace = await Namespace.get(id)
    if not api_entity_is_found(namespace):
        raise ResourceNotFoundException()
    return namespace


async def get_namespace_out(id: PydanticObjectId) -> NamespaceOut:
    namespace: Namespace = await get_namespace(id)
    return NamespaceOut(**namespace.model_dump(by_alias=False))


async def delete_namespace(namespace: Namespace):
    return await namespace.delete()
