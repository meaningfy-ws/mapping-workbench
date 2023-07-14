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
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.test_data_suite.services.entities_for_api import (
    list_test_data_suites as list_test_data_suites_for_api,
    create_test_data_suite as create_test_data_suite_for_api,
    update_test_data_suite as update_test_data_suite_for_api,
    get_test_data_suite as get_test_data_suite_for_api,
    delete_test_data_suite as delete_test_data_suite_for_api,
    list_test_data_suite_file_resources as list_test_data_suite_file_resources_for_api,
    create_test_data_suite_file_resource as create_test_data_suite_file_resource_for_api,
    update_test_data_file_resource as update_test_data_file_resource_for_api,
    get_test_data_file_resource as get_test_data_file_resource_for_api,
    delete_test_data_file_resource as delete_test_data_file_resource_for_api
)
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/test_data_suites"
TAG = "test_data_suites"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description="List Test data suites",
    name="test_data_suites:list",
    response_model=List[TestDataSuite]
)
async def list_test_data_suites() -> JSONResponse:
    items = await list_test_data_suites_for_api()
    return JSONResponse(
        content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)))
    )


@router.post(
    "",
    description="Add new Test data suite",
    name="test_data_suites:create_test_data_suite",
    response_model=TestDataSuite
)
async def create_test_data_suite(
        test_data_suite: TestDataSuite,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await create_test_data_suite_for_api(test_data_suite=test_data_suite, user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@router.patch(
    "/{id}",
    name="test_data_suites:update_test_data_suite",
    response_model=TestDataSuite
)
async def update_test_data_suite(
        id: PydanticObjectId,
        data: Dict,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    await update_test_data_suite_for_api(id, data, user=user)
    data = await get_test_data_suite_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.get(
    "/{id}",
    name="test_data_suites:get_test_data_suite",
    response_model=TestDataSuite
)
async def get_test_data_suite(id: PydanticObjectId) -> JSONResponse:
    data = await get_test_data_suite_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.delete(
    "/{id}",
    name="test_data_suites:delete_test_data_suite",
    response_model=JSONEmptyContentWithId
)
async def delete_test_data_suite(id: PydanticObjectId):
    await delete_test_data_suite_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )


@router.get(
    "/{id}/file_resources",
    description="List Test data suite file resources",
    name="test_data_suites:list_test_data_suite_file_resources",
    response_model=List[TestDataFileResource]
)
async def list_test_data_suite_file_resources(
        id: PydanticObjectId = None
) -> JSONResponse:
    items = await list_test_data_suite_file_resources_for_api(id)
    return JSONResponse(
        content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)))
    )


@router.post(
    "/{id}/file_resources",
    description="Add new Test data suite file resource",
    name="test_data_suites:create_test_data_suite_file_resources",
    response_model=TestDataFileResource
)
async def create_test_data_suite_file_resources(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    test_data_file_resource = TestDataFileResource(**await file_resource_data_from_form_request(req))
    data = await create_test_data_suite_file_resource_for_api(
        id=id,
        test_data_file_resource=test_data_file_resource,
        user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@router.patch(
    "/file_resources/{id}",
    name="test_data_suites:update_test_data_file_resource",
    response_model=TestDataFileResource
)
async def update_test_data_suite(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await file_resource_data_from_form_request(req)
    await update_test_data_file_resource_for_api(id, data, user=user)
    data = await get_test_data_file_resource_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.get(
    "/file_resources/{id}",
    name="test_data_suites:get_test_data_file_resource",
    response_model=TestDataFileResource
)
async def get_test_data_file_resource(id: PydanticObjectId) -> JSONResponse:
    data = await get_test_data_file_resource_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.delete(
    "/file_resources/{id}",
    name="test_data_suites:delete_test_data_file_resource",
    response_model=TestDataFileResource
)
async def delete_test_data_file_resource(id: PydanticObjectId):
    await delete_test_data_file_resource_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )
