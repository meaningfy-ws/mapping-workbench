from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from starlette.requests import Request

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request
from mapping_workbench.backend.ontology_file_collection.models.entity import OntologyFileCollection, \
    OntologyFileResource, OntologyFileResourceCreateIn, OntologyFileResourceUpdateIn
from mapping_workbench.backend.ontology_file_collection.models.entity_api_response import \
    APIListOntologyFileCollectionsPaginatedResponse, APIListOntologyFileResourcesPaginatedResponse
from mapping_workbench.backend.ontology_file_collection.services.api import (
    list_ontology_file_collections,
    create_ontology_file_collection,
    update_ontology_file_collection,
    get_ontology_file_collection,
    delete_ontology_file_collection,
    list_ontology_file_collection_file_resources,
    create_ontology_file_collection_file_resource,
    update_ontology_file_resource,
    get_ontology_file_resource,
    delete_ontology_file_resource
)
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.api import get_project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/ontology_file_collections"
TAG = "ontology_file_collections"
NAME_FOR_MANY = "ontology_file_collections"
NAME_FOR_ONE = "ontology_file_collection"
FILE_RESOURCE_NAME_FOR_MANY = "ontology_file_resources"
FILE_RESOURCE_NAME_FOR_ONE = "ontology_file_resource"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListOntologyFileCollectionsPaginatedResponse
)
async def route_list_ontology_file_collections(
        project: PydanticObjectId = None,
        page: int = None,
        limit: int = None,
        q: str = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if q is not None:
        filters['q'] = q

    await get_project(project)

    items, total_count = await list_ontology_file_collections(filters, page, limit)
    return APIListOntologyFileCollectionsPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=OntologyFileCollection,
    status_code=status.HTTP_201_CREATED
)
async def route_create_ontology_file_collection(
        ontology_file_collection: OntologyFileCollection,
        user: User = Depends(current_active_user)
):
    return await create_ontology_file_collection(ontology_file_collection, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=OntologyFileCollection
)
async def route_update_ontology_file_collection(
        data: OntologyFileCollection,
        ontology_file_collection: OntologyFileCollection = Depends(get_ontology_file_collection),
        user: User = Depends(current_active_user)
):
    return await update_ontology_file_collection(ontology_file_collection, data, user=user)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=OntologyFileCollection
)
async def route_get_ontology_file_collection(
        ontology_file_collection: OntologyFileCollection = Depends(get_ontology_file_collection)):
    return ontology_file_collection


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_ontology_file_collection(
        ontology_file_collection: OntologyFileCollection = Depends(get_ontology_file_collection)):
    await delete_ontology_file_collection(ontology_file_collection)
    return APIEmptyContentWithIdResponse(id=ontology_file_collection.id)


@router.get(
    "/{id}/file_resources",
    description=f"List {FILE_RESOURCE_NAME_FOR_MANY}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:list_{FILE_RESOURCE_NAME_FOR_MANY}",
    response_model=APIListOntologyFileResourcesPaginatedResponse
)
async def route_list_ontology_file_collection_file_resources(
        ontology_file_collection: OntologyFileCollection = Depends(get_ontology_file_collection),
        project: PydanticObjectId = None,
        page: int = None,
        limit: int = None,
        q: str = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if q is not None:
        filters['q'] = q

    items, total_count = \
        await list_ontology_file_collection_file_resources(ontology_file_collection, filters, page, limit)
    return APIListOntologyFileResourcesPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "/{id}/file_resources",
    description=f"Create {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:create_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=OntologyFileResource,
    status_code=status.HTTP_201_CREATED
)
async def route_create_ontology_file_collection_file_resources(
        req: Request,
        ontology_file_collection: OntologyFileCollection = Depends(get_ontology_file_collection),
        user: User = Depends(current_active_user)
):
    data = OntologyFileResourceCreateIn(**(await file_resource_data_from_form_request(req)))
    return await create_ontology_file_collection_file_resource(
        ontology_file_collection=ontology_file_collection,
        data=data,
        user=user
    )


@router.patch(
    "/file_resources/{id}",
    description=f"Update {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:update_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=OntologyFileResource
)
async def route_update_ontology_file_resource(
        req: Request,
        ontology_file_resource: OntologyFileResource = Depends(get_ontology_file_resource),
        user: User = Depends(current_active_user)
):
    data = OntologyFileResourceUpdateIn(**(await file_resource_data_from_form_request(req)))
    return await update_ontology_file_resource(ontology_file_resource, data, user=user)


@router.get(
    "/file_resources/{id}",
    description=f"Get {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:get_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=OntologyFileResource
)
async def route_get_ontology_file_resource(
        ontology_file_resource: OntologyFileResource = Depends(get_ontology_file_resource)
):
    return ontology_file_resource


@router.delete(
    "/file_resources/{id}",
    description=f"Delete {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:delete_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_ontology_file_resource(
        ontology_file_resource: OntologyFileResource = Depends(get_ontology_file_resource)):
    await delete_ontology_file_resource(ontology_file_resource)
    return APIEmptyContentWithIdResponse(id=ontology_file_resource.id)
