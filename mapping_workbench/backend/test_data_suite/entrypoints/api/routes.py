from typing import Dict, List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from mapping_workbench.backend.core.models.api_response import JSONEmptyContentWithId
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite
from mapping_workbench.backend.test_data_suite.services.entities_for_api import (
    list_test_data_suites as list_test_data_suites_for_api,
    create_test_data_suite as create_test_data_suite_for_api,
    update_test_data_suite as update_test_data_suite_for_api,
    get_test_data_suite as get_test_data_suite_for_api,
    delete_test_data_suite as delete_test_data_suite_for_api
)
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/test_data_suites"
TAG = "test_data_suites"

sub_router = APIRouter()


@sub_router.get(
    "",
    description="List test data suites",
    name="test_data_suites:list",
    response_model=List[TestDataSuite]
)
async def list_test_data_suites() -> JSONResponse:
    data = await list_test_data_suites_for_api()
    return JSONResponse(
        content=jsonable_encoder(data)
    )


@sub_router.post(
    "",
    description="Add new test data suite",
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


@sub_router.patch(
    "/{id}",
    name="test_data_suites:update_test_data_suite",
    response_model=JSONEmptyContentWithId
)
async def update_test_data_suite(
        id: PydanticObjectId,
        data: Dict,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    await update_test_data_suite_for_api(id, data, user=user)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(id=id))
    )


@sub_router.get(
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


@sub_router.delete(
    "/{id}",
    name="test_data_suites:delete_test_data_suite",
    response_model=JSONEmptyContentWithId
)
async def delete_test_data_suite(id: PydanticObjectId):
    await delete_test_data_suite_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(id=id))
    )


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
