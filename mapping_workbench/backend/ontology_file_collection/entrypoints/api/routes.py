from typing import Dict, List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from starlette.requests import Request

from mapping_workbench.backend.core.models.api_response import JSONEmptyContentWithId, JSONPagedResponse
from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request
from mapping_workbench.backend.ontology_file_collection.models.entity import OntologyFileCollection, \
    OntologyFileResource
from mapping_workbench.backend.ontology_file_collection.services.entities_for_api import (
    list_ontology_file_collections as list_ontology_file_collections_for_api,
    create_ontology_file_collection as create_ontology_file_collection_for_api,
    update_ontology_file_collection as update_ontology_file_collection_for_api,
    get_ontology_file_collection as get_ontology_file_collection_for_api,
    delete_ontology_file_collection as delete_ontology_file_collection_for_api,
    list_ontology_file_collection_file_resources as list_ontology_file_collection_file_resources_for_api,
    create_ontology_file_collection_file_resource as create_ontology_file_collection_file_resource_for_api,
    update_ontology_file_resource as update_ontology_file_resource_for_api,
    get_ontology_file_resource as get_ontology_file_resource_for_api,
    delete_ontology_file_resource as delete_ontology_file_resource_for_api
)
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/ontology_file_collections"
TAG = "ontology_file_collections"

sub_router = APIRouter()


@sub_router.get(
    "",
    description="List Ontology file collections",
    name="ontology_file_collections:list",
    response_model=List[OntologyFileCollection]
)
async def list_ontology_file_collections() -> JSONResponse:
    items = await list_ontology_file_collections_for_api()
    return JSONResponse(
        content=jsonable_encoder(JSONPagedResponse(items=items, count=len(items)))
    )


@sub_router.post(
    "",
    description="Add new Ontology file collection",
    name="ontology_file_collections:create_ontology_file_collection",
    response_model=OntologyFileCollection
)
async def create_ontology_file_collection(
        ontology_file_collection: OntologyFileCollection,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await create_ontology_file_collection_for_api(ontology_file_collection=ontology_file_collection, user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@sub_router.patch(
    "/{id}",
    name="ontology_file_collections:update_ontology_file_collection",
    response_model=OntologyFileCollection
)
async def update_ontology_file_collection(
        id: PydanticObjectId,
        data: Dict,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    await update_ontology_file_collection_for_api(id, data, user=user)
    data = await get_ontology_file_collection_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.get(
    "/{id}",
    name="ontology_file_collections:get_ontology_file_collection",
    response_model=OntologyFileCollection
)
async def get_ontology_file_collection(id: PydanticObjectId) -> JSONResponse:
    data = await get_ontology_file_collection_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.delete(
    "/{id}",
    name="ontology_file_collections:delete_ontology_file_collection",
    response_model=JSONEmptyContentWithId
)
async def delete_ontology_file_collection(id: PydanticObjectId):
    await delete_ontology_file_collection_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )


@sub_router.get(
    "/{id}/file_resources",
    description="List Ontology file collection file resources",
    name="ontology_file_collections:list_ontology_file_collection_file_resources",
    response_model=List[OntologyFileResource]
)
async def list_ontology_file_collection_file_resources(
        id: PydanticObjectId = None
) -> JSONResponse:
    items = await list_ontology_file_collection_file_resources_for_api(id)
    return JSONResponse(
        content=jsonable_encoder(JSONPagedResponse(items=items, count=len(items)))
    )


@sub_router.post(
    "/{id}/file_resources",
    description="Add new Ontology file collection file resource",
    name="ontology_file_collections:create_ontology_file_collection_file_resources",
    response_model=OntologyFileResource
)
async def create_ontology_file_collection_file_resources(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    ontology_file_resource = OntologyFileResource(**await file_resource_data_from_form_request(req))
    data = await create_ontology_file_collection_file_resource_for_api(
        id=id,
        ontology_file_resource=ontology_file_resource,
        user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@sub_router.patch(
    "/file_resources/{id}",
    name="ontology_file_collections:update_ontology_file_resource",
    response_model=OntologyFileResource
)
async def update_ontology_file_collection(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await file_resource_data_from_form_request(req)
    await update_ontology_file_resource_for_api(id, data, user=user)
    data = await get_ontology_file_resource_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.get(
    "/file_resources/{id}",
    name="ontology_file_collections:get_ontology_file_resource",
    response_model=OntologyFileResource
)
async def get_ontology_file_resource(id: PydanticObjectId) -> JSONResponse:
    data = await get_ontology_file_resource_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.delete(
    "/file_resources/{id}",
    name="ontology_file_collections:delete_ontology_file_resource",
    response_model=OntologyFileResource
)
async def delete_ontology_file_resource(id: PydanticObjectId):
    await delete_ontology_file_resource_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
