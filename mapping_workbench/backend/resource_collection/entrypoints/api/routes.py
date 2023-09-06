from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from starlette.requests import Request

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile, \
    ResourceFileCreateIn, ResourceFileUpdateIn
from mapping_workbench.backend.resource_collection.models.entity_api_response import \
    APIListResourceCollectionsPaginatedResponse, APIListResourceFilesPaginatedResponse
from mapping_workbench.backend.resource_collection.services.api import (
    list_resource_collections,
    create_resource_collection,
    update_resource_collection,
    get_resource_collection,
    delete_resource_collection,
    list_resource_collection_file_resources,
    create_resource_collection_file_resource,
    update_resource_file,
    get_resource_file,
    delete_resource_file
)
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/resource_collections"
TAG = "resource_collections"
NAME_FOR_MANY = "resource_collections"
NAME_FOR_ONE = "resource_collection"
FILE_RESOURCE_NAME_FOR_MANY = "resource_files"
FILE_RESOURCE_NAME_FOR_ONE = "resource_file"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListResourceCollectionsPaginatedResponse
)
async def route_list_resource_collections(
        project: PydanticObjectId = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    items: List[ResourceCollection] = await list_resource_collections(filters)
    return APIListResourceCollectionsPaginatedResponse(items=items, count=len(items))


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=ResourceCollection,
    status_code=status.HTTP_201_CREATED
)
async def route_create_resource_collection(
        resource_collection: ResourceCollection,
        user: User = Depends(current_active_user)
):
    return await create_resource_collection(resource_collection=resource_collection, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=ResourceCollection
)
async def route_update_resource_collection(
        id: PydanticObjectId,
        resource_collection_data: ResourceCollection,
        user: User = Depends(current_active_user)
):
    await update_resource_collection(id=id, resource_collection_data=resource_collection_data, user=user)
    return await get_resource_collection(id)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=ResourceCollection
)
async def route_get_resource_collection(resource_collection: ResourceCollection = Depends(get_resource_collection)):
    return resource_collection


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_resource_collection(resource_collection: ResourceCollection = Depends(get_resource_collection)):
    await delete_resource_collection(resource_collection)
    APIEmptyContentWithIdResponse(_id=resource_collection.id)


@router.get(
    "/{id}/file_resources",
    description=f"List {FILE_RESOURCE_NAME_FOR_MANY}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:list_{FILE_RESOURCE_NAME_FOR_MANY}",
    response_model=APIListResourceFilesPaginatedResponse
)
async def route_list_resource_collection_file_resources(
        id: PydanticObjectId = None
):
    items: List[ResourceFile] = await list_resource_collection_file_resources(id)
    return APIListResourceFilesPaginatedResponse(items=items, count=len(items))


@router.post(
    "/{id}/file_resources",
    description=f"Create {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:create_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=ResourceFile,
    status_code=status.HTTP_201_CREATED
)
async def route_create_resource_collection_file_resources(
        req: Request,
        resource_collection: ResourceCollection = Depends(get_resource_collection),
        user: User = Depends(current_active_user)
):
    data = ResourceFileCreateIn(**(await file_resource_data_from_form_request(req)))
    return await create_resource_collection_file_resource(
        resource_collection=resource_collection,
        data=data,
        user=user
    )


@router.patch(
    "/file_resources/{id}",
    description=f"Update {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:update_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=ResourceFile
)
async def route_update_resource_file(
        req: Request,
        resource_file: ResourceFile = Depends(get_resource_file),
        user: User = Depends(current_active_user)
):
    data = ResourceFileUpdateIn(**(await file_resource_data_from_form_request(req)))
    return await update_resource_file(resource_file, data, user=user)


@router.get(
    "/file_resources/{id}",
    description=f"Get {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:get_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=ResourceFile
)
async def route_get_resource_file(
        resource_file: ResourceFile = Depends(get_resource_file)
):
    return resource_file


@router.delete(
    "/file_resources/{id}",
    description=f"Delete {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:delete_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_resource_file(resource_file: ResourceFile = Depends(get_resource_file)):
    await delete_resource_file(resource_file)
    return APIEmptyContentWithIdResponse(_id=resource_file.id)
