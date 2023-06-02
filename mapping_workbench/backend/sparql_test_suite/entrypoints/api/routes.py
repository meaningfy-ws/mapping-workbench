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
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.sparql_test_suite.services.entities_for_api import (
    list_sparql_test_suites as list_sparql_test_suites_for_api,
    create_sparql_test_suite as create_sparql_test_suite_for_api,
    update_sparql_test_suite as update_sparql_test_suite_for_api,
    get_sparql_test_suite as get_sparql_test_suite_for_api,
    delete_sparql_test_suite as delete_sparql_test_suite_for_api,
    list_sparql_test_suite_file_resources as list_sparql_test_suite_file_resources_for_api,
    create_sparql_test_suite_file_resource as create_sparql_test_suite_file_resource_for_api,
    update_sparql_test_file_resource as update_sparql_test_file_resource_for_api,
    get_sparql_test_file_resource as get_sparql_test_file_resource_for_api,
    delete_sparql_test_file_resource as delete_sparql_test_file_resource_for_api
)
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/sparql_test_suites"
TAG = "sparql_test_suites"

sub_router = APIRouter()


@sub_router.get(
    "",
    description="List SPARQL test suites",
    name="sparql_test_suites:list",
    response_model=List[SPARQLTestSuite]
)
async def list_sparql_test_suites() -> JSONResponse:
    items = await list_sparql_test_suites_for_api()
    return JSONResponse(
        content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)))
    )


@sub_router.post(
    "",
    description="Add new SPARQL test suite",
    name="sparql_test_suites:create_sparql_test_suite",
    response_model=SPARQLTestSuite
)
async def create_sparql_test_suite(
        sparql_test_suite: SPARQLTestSuite,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await create_sparql_test_suite_for_api(sparql_test_suite=sparql_test_suite, user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@sub_router.patch(
    "/{id}",
    name="sparql_test_suites:update_sparql_test_suite",
    response_model=SPARQLTestSuite
)
async def update_sparql_test_suite(
        id: PydanticObjectId,
        data: Dict,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    await update_sparql_test_suite_for_api(id, data, user=user)
    data = await get_sparql_test_suite_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.get(
    "/{id}",
    name="sparql_test_suites:get_sparql_test_suite",
    response_model=SPARQLTestSuite
)
async def get_sparql_test_suite(id: PydanticObjectId) -> JSONResponse:
    data = await get_sparql_test_suite_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.delete(
    "/{id}",
    name="sparql_test_suites:delete_sparql_test_suite",
    response_model=JSONEmptyContentWithId
)
async def delete_sparql_test_suite(id: PydanticObjectId):
    await delete_sparql_test_suite_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )


@sub_router.get(
    "/{id}/file_resources",
    description="List SPARQL test suite file resources",
    name="sparql_test_suites:list_sparql_test_suite_file_resources",
    response_model=List[SPARQLTestFileResource]
)
async def list_sparql_test_suite_file_resources(
        id: PydanticObjectId = None
) -> JSONResponse:
    items = await list_sparql_test_suite_file_resources_for_api(id)
    return JSONResponse(
        content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)))
    )


@sub_router.post(
    "/{id}/file_resources",
    description="Add new SPARQL test suite file resource",
    name="sparql_test_suites:create_sparql_test_suite_file_resources",
    response_model=SPARQLTestFileResource
)
async def create_sparql_test_suite_file_resources(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    sparql_test_file_resource = SPARQLTestFileResource(**await file_resource_data_from_form_request(req))
    data = await create_sparql_test_suite_file_resource_for_api(
        id=id,
        sparql_test_file_resource=sparql_test_file_resource,
        user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@sub_router.patch(
    "/file_resources/{id}",
    name="sparql_test_suites:update_sparql_test_file_resource",
    response_model=SPARQLTestFileResource
)
async def update_sparql_test_suite(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await file_resource_data_from_form_request(req)
    await update_sparql_test_file_resource_for_api(id, data, user=user)
    data = await get_sparql_test_file_resource_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.get(
    "/file_resources/{id}",
    name="sparql_test_suites:get_sparql_test_file_resource",
    response_model=SPARQLTestFileResource
)
async def get_sparql_test_file_resource(id: PydanticObjectId) -> JSONResponse:
    data = await get_sparql_test_file_resource_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.delete(
    "/file_resources/{id}",
    name="sparql_test_suites:delete_sparql_test_file_resource",
    response_model=SPARQLTestFileResource
)
async def delete_sparql_test_file_resource(id: PydanticObjectId):
    await delete_sparql_test_file_resource_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
