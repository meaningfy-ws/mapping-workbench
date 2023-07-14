from typing import Dict, List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from starlette.requests import Request

from mapping_workbench.backend.core.models.api_response import JSONEmptyContentWithId, JSONPagedReponse
from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile
from mapping_workbench.backend.resource_collection.services.entities_for_api import (
    list_resource_collections as list_resource_collections_for_api,
    create_resource_collection as create_resource_collection_for_api,
    update_resource_collection as update_resource_collection_for_api,
    get_resource_collection as get_resource_collection_for_api,
    delete_resource_collection as delete_resource_collection_for_api,
    list_resource_collection_file_resources as list_resource_collection_file_resources_for_api,
    create_resource_collection_file_resource as create_resource_collection_file_resource_for_api,
    update_resource_file as update_resource_file_for_api,
    get_resource_file as get_resource_file_for_api,
    delete_resource_file as delete_resource_file_for_api
)
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/resource_collections"
TAG = "resource_collections"

router = APIRouter(
    prefix=ROUTE_PREFIX, 
    tags=[TAG]
)


@router.get(
    "",
    description="List Resource collections",
    name="resource_collections:list",
    response_model=List[ResourceCollection]
)
async def list_resource_collections() -> JSONResponse:
    items = await list_resource_collections_for_api()
    return JSONResponse(
        content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)))
    )


@router.post(
    "",
    description="Add new Resource collection",
    name="resource_collections:create_resource_collection",
    response_model=ResourceCollection
)
async def create_resource_collection(
        resource_collection: ResourceCollection,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await create_resource_collection_for_api(resource_collection=resource_collection, user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@router.patch(
    "/{id}",
    name="resource_collections:update_resource_collection",
    response_model=ResourceCollection
)
async def update_resource_collection(
        id: PydanticObjectId,
        data: Dict,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    await update_resource_collection_for_api(id, data, user=user)
    data = await get_resource_collection_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.get(
    "/{id}",
    name="resource_collections:get_resource_collection",
    response_model=ResourceCollection
)
async def get_resource_collection(id: PydanticObjectId) -> JSONResponse:
    data = await get_resource_collection_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.delete(
    "/{id}",
    name="resource_collections:delete_resource_collection",
    response_model=JSONEmptyContentWithId
)
async def delete_resource_collection(id: PydanticObjectId):
    await delete_resource_collection_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )


@router.get(
    "/{id}/file_resources",
    description="List Resource collection file resources",
    name="resource_collections:list_resource_collection_file_resources",
    response_model=List[ResourceFile]
)
async def list_resource_collection_file_resources(
        id: PydanticObjectId = None
) -> JSONResponse:
    items = await list_resource_collection_file_resources_for_api(id)
    return JSONResponse(
        content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)))
    )


@router.post(
    "/{id}/file_resources",
    description="Add new Resource collection file resource",
    name="resource_collections:create_resource_collection_file_resources",
    response_model=ResourceFile
)
async def create_resource_collection_file_resources(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    resource_file = ResourceFile(**await file_resource_data_from_form_request(req))
    data = await create_resource_collection_file_resource_for_api(
        id=id,
        resource_file=resource_file,
        user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@router.patch(
    "/file_resources/{id}",
    name="resource_collections:update_resource_file",
    response_model=ResourceFile
)
async def update_resource_collection(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await file_resource_data_from_form_request(req)
    await update_resource_file_for_api(id, data, user=user)
    data = await get_resource_file_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.get(
    "/file_resources/{id}",
    name="resource_collections:get_resource_file",
    response_model=ResourceFile
)
async def get_resource_file(id: PydanticObjectId) -> JSONResponse:
    data = await get_resource_file_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.delete(
    "/file_resources/{id}",
    name="resource_collections:delete_resource_file",
    response_model=ResourceFile
)
async def delete_resource_file(id: PydanticObjectId):
    await delete_resource_file_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )
