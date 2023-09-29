from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found, \
    request_create_data, prepare_search_param, pagination_params
from mapping_workbench.backend.ontology_file_collection.models.entity import OntologyFileCollection, \
    OntologyFileResource, OntologyFileResourceCreateIn, OntologyFileResourceUpdateIn
from mapping_workbench.backend.user.models.user import User


async def list_ontology_file_collections(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[OntologyFileCollection], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[OntologyFileCollection] = await OntologyFileCollection.find(
        query_filters,
        projection_model=OntologyFileCollection,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await OntologyFileCollection.find(query_filters).count()
    return items, total_count


async def create_ontology_file_collection(
        ontology_file_collection: OntologyFileCollection,
        user: User
) -> OntologyFileCollection:
    ontology_file_collection.on_create(user=user)
    return await ontology_file_collection.create()


async def update_ontology_file_collection(
        ontology_file_collection: OntologyFileCollection,
        data: OntologyFileCollection,
        user: User
):
    return await ontology_file_collection.set(
        request_update_data(data, user=user)
    )


async def get_ontology_file_collection(id: PydanticObjectId) -> OntologyFileCollection:
    ontology_file_collection: OntologyFileCollection = await OntologyFileCollection.get(id)
    if not api_entity_is_found(ontology_file_collection):
        raise ResourceNotFoundException()
    return ontology_file_collection


async def delete_ontology_file_collection(ontology_file_collection: OntologyFileCollection):
    return await ontology_file_collection.delete()


async def list_ontology_file_collection_file_resources(
        ontology_file_collection: OntologyFileCollection,
        filters=None, page: int = None, limit: int = None
) -> (List[OntologyFileResource], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    query_filters['ontology_file_collection'] = OntologyFileCollection.link_from_id(ontology_file_collection.id)

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[OntologyFileResource] = await OntologyFileResource.find(
        query_filters,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await OntologyFileResource.find(query_filters).count()
    return items, total_count


async def create_ontology_file_collection_file_resource(
        ontology_file_collection: OntologyFileCollection,
        data: OntologyFileResourceCreateIn,
        user: User
) -> OntologyFileResource:
    data.ontology_file_collection = ontology_file_collection
    ontology_file_resource = \
        OntologyFileResource(
            **request_create_data(data, user=user)
        )
    return await ontology_file_resource.create()


async def update_ontology_file_resource(
        ontology_file_resource: OntologyFileResource,
        data: OntologyFileResourceUpdateIn,
        user: User) -> OntologyFileResource:
    return await ontology_file_resource.set(
        request_update_data(data, user=user)
    )


async def get_ontology_file_resource(id: PydanticObjectId) -> OntologyFileResource:
    ontology_file_resource = await OntologyFileResource.get(id)
    if not api_entity_is_found(ontology_file_resource):
        raise ResourceNotFoundException()
    return ontology_file_resource


async def delete_ontology_file_resource(ontology_file_resource: OntologyFileResource):
    return await ontology_file_resource.delete()
