from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found
from mapping_workbench.backend.ontology_file_collection.models.entity import OntologyFileCollection, \
    OntologyFileResource
from mapping_workbench.backend.user.models.user import User


async def list_ontology_file_collections(filters=None) -> List[OntologyFileCollection]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await OntologyFileCollection.find(
        query_filters,
        projection_model=OntologyFileCollection,
        fetch_links=False
    ).to_list()


async def create_ontology_file_collection(ontology_file_collection: OntologyFileCollection,
                                          user: User) -> OntologyFileCollection:
    ontology_file_collection.on_create(user=user)
    return await ontology_file_collection.create()


async def update_ontology_file_collection(id: PydanticObjectId, ontology_file_collection_data: OntologyFileCollection,
                                          user: User):
    ontology_file_collection: OntologyFileCollection = await OntologyFileCollection.get(id)
    if not api_entity_is_found(ontology_file_collection):
        raise ResourceNotFoundException()

    request_data = request_update_data(ontology_file_collection_data)
    update_data = request_update_data(OntologyFileCollection(**request_data).on_update(user=user))
    return await ontology_file_collection.set(update_data)


async def get_ontology_file_collection(id: PydanticObjectId) -> OntologyFileCollection:
    ontology_file_collection: OntologyFileCollection = await OntologyFileCollection.get(id)
    if not api_entity_is_found(ontology_file_collection):
        raise ResourceNotFoundException()
    return OntologyFileCollection(**ontology_file_collection.dict(by_alias=False))


async def delete_ontology_file_collection(id: PydanticObjectId):
    ontology_file_collection: OntologyFileCollection = await OntologyFileCollection.get(id)
    if not api_entity_is_found(ontology_file_collection):
        raise ResourceNotFoundException()
    return await ontology_file_collection.delete()


async def list_ontology_file_collection_file_resources(
        id: PydanticObjectId = None,
        filters=None
) -> List[OntologyFileResource]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await OntologyFileResource.find(
        OntologyFileResource.ontology_file_collection == OntologyFileCollection.link_from_id(id),
        query_filters,
        fetch_links=False
    ).to_list()


async def create_ontology_file_collection_file_resource(
        id: PydanticObjectId,
        ontology_file_resource: OntologyFileResource,
        user: User
) -> OntologyFileResource:
    ontology_file_resource.ontology_file_collection = OntologyFileCollection.link_from_id(id)
    ontology_file_resource.on_create(user=user)
    return await ontology_file_resource.create()


async def update_ontology_file_resource(
        id: PydanticObjectId,
        ontology_file_resource_data: OntologyFileResource,
        user: User):
    ontology_file_resource: OntologyFileResource = await OntologyFileResource.get(id)
    if not api_entity_is_found(ontology_file_resource):
        raise ResourceNotFoundException()
    request_data = request_update_data(ontology_file_resource_data)
    update_data = request_update_data(OntologyFileResource(**request_data).on_update(user=user))
    return await ontology_file_resource.set(update_data)


async def get_ontology_file_resource(id: PydanticObjectId) -> OntologyFileResource:
    ontology_file_resource = await OntologyFileResource.get(id)
    if not api_entity_is_found(ontology_file_resource):
        raise ResourceNotFoundException()
    return ontology_file_resource


async def delete_ontology_file_resource(id: PydanticObjectId):
    ontology_file_resource: OntologyFileResource = await OntologyFileResource.get(id)
    if not api_entity_is_found(ontology_file_resource):
        raise ResourceNotFoundException()
    return await ontology_file_resource.delete()
