from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.ontology_file_collection.models.entity import OntologyFileCollection, \
    OntologyFileResource, OntologyFileCollectionOut
from mapping_workbench.backend.user.models.user import User


async def list_ontology_file_collections() -> List[OntologyFileCollectionOut]:
    return await OntologyFileCollection.find(fetch_links=False).project(OntologyFileCollectionOut).to_list()


async def create_ontology_file_collection(ontology_file_collection: OntologyFileCollection, user: User) -> OntologyFileCollection:
    ontology_file_collection.on_create(user=user)
    return await ontology_file_collection.create()


async def update_ontology_file_collection(id: PydanticObjectId, data: Dict, user: User):
    ontology_file_collection: OntologyFileCollection = await OntologyFileCollection.get(id)
    if not ontology_file_collection:
        raise ResourceNotFoundException()
    update_data = OntologyFileCollection(**data).on_update(user=user).dict_for_update()
    return await ontology_file_collection.set(update_data)


async def get_ontology_file_collection(id: PydanticObjectId) -> OntologyFileCollection:
    ontology_file_collection = await OntologyFileCollection.get(id)
    if not ontology_file_collection:
        raise ResourceNotFoundException()
    return ontology_file_collection


async def delete_ontology_file_collection(id: PydanticObjectId):
    ontology_file_collection: OntologyFileCollection = await OntologyFileCollection.get(id)
    if not ontology_file_collection:
        raise ResourceNotFoundException()
    return await ontology_file_collection.delete()


async def list_ontology_file_collection_file_resources(
        id: PydanticObjectId = None
) -> List[OntologyFileResource]:
    return await OntologyFileResource.find(
        OntologyFileResource.ontology_file_collection == OntologyFileCollection.link_from_id(id),
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


async def update_ontology_file_resource(id: PydanticObjectId, data: Dict, user: User):
    ontology_file_resource: OntologyFileResource = await OntologyFileResource.get(id)
    if not ontology_file_resource:
        raise ResourceNotFoundException()
    update_data = OntologyFileResource(**data).on_update(user=user).dict_for_update()
    return await ontology_file_resource.set(update_data)


async def get_ontology_file_resource(id: PydanticObjectId) -> OntologyFileResource:
    ontology_file_resource = await OntologyFileResource.get(id)
    if not ontology_file_resource:
        raise ResourceNotFoundException()
    return ontology_file_resource


async def delete_ontology_file_resource(id: PydanticObjectId):
    ontology_file_resource: OntologyFileResource = await OntologyFileResource.get(id)
    if not ontology_file_resource:
        raise ResourceNotFoundException()
    return await ontology_file_resource.delete()
